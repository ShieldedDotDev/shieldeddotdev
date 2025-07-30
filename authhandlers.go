package shieldeddotdev

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/go-github/v43/github"
	"golang.org/x/oauth2"
	goauth "golang.org/x/oauth2/github"
)

type DebugAuthHandler struct {
	um      *model.UserMapper
	jwtAuth *JwtAuth
}

func NewDebugAuthHandler(um *model.UserMapper, jwtAuth *JwtAuth) *DebugAuthHandler {
	return &DebugAuthHandler{um, jwtAuth}
}

func (ah *DebugAuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	user := ah.um.GetDebugUser()

	err := ah.jwtAuth.Authorize(w, user.UserID)
	if err != nil {
		slog.Warn("Failed to sign jwt", slog.Any("error", err))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	http.Redirect(w, r, "/dashboard.html", http.StatusTemporaryRedirect)
}

type GitHubAuthHandler struct {
	um     *model.UserMapper
	config *oauth2.Config

	jwtAuth *JwtAuth
}

func NewGitHubAuthHandler(um *model.UserMapper, clientID string, clientSecret string, jwtAuth *JwtAuth) *GitHubAuthHandler {
	conf := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Scopes:       []string{"user:email"},
		Endpoint:     goauth.Endpoint,
	}

	return &GitHubAuthHandler{
		um:     um,
		config: conf,

		jwtAuth: jwtAuth,
	}
}

func (ah *GitHubAuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	u1 := uuid.Must(uuid.NewV4())

	cookie := &http.Cookie{
		Expires: time.Now().Add(15 * time.Minute),
		Name:    "gh-auth-state",
		Value:   u1.String(),
		Path:    "/",
	}
	http.SetCookie(w, cookie)

	url := ah.config.AuthCodeURL(u1.String(), oauth2.AccessTypeOnline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (ah *GitHubAuthHandler) CallbackHandler(w http.ResponseWriter, r *http.Request) {

	c, err := r.Cookie("gh-auth-state")
	if err != nil {
		slog.Info("missing auth-state cookie")
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	state := r.FormValue("state")
	if state != c.Value {
		slog.Warn("invalid oauth state", slog.String("expected", c.Value), slog.String("got", state))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	code := r.FormValue("code")
	token, err := ah.config.Exchange(context.Background(), code)
	if err != nil {
		slog.Error("ah.config.Exchange() failed to exchange code", slog.Any("error", err))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	oauthClient := ah.config.Client(r.Context(), token)
	client := github.NewClient(oauthClient)
	user, _, err := client.Users.Get(context.Background(), "")
	if err != nil {
		slog.Error("client.Users.Get() failed to get user", slog.Any("error", err))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	slog.Info("log in successful",
		slog.String("type", "github"),
		slog.String("login", user.GetLogin()),
		slog.String("email", user.GetEmail()),
		slog.Int64("id", user.GetID()))

	err = ah.um.Save(&model.User{
		UserID: user.GetID(),
		Login:  user.GetLogin(),
		Email:  user.GetEmail(),
	})

	if err != nil {
		slog.Error("Failed to record credentials", slog.Any("error", err))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	err = ah.jwtAuth.Authorize(w, *user.ID)
	if err != nil {
		slog.Error("Failed to sign jwt", slog.Any("error", err))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	http.Redirect(w, r, "/dashboard.html", http.StatusTemporaryRedirect)
}

type JwtAuth struct {
	Secret []byte
}

func (j *JwtAuth) Authorize(w http.ResponseWriter, uid int64) error {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		ID: strconv.FormatInt(uid, 10),
	})

	tokenString, err := jwtToken.SignedString(j.Secret)
	if err != nil {
		return err
	}

	cookie := &http.Cookie{
		Expires: time.Now().Add(36 * time.Hour),
		Name:    "auth",
		Value:   tokenString,
		Path:    "/",

		Secure:   true,
		HttpOnly: true,
	}

	http.SetCookie(w, cookie)

	return nil
}

func (j *JwtAuth) GetAuth(r *http.Request) *int64 {
	c, err := r.Cookie("auth")
	if err != nil {
		return nil
	}

	token, err := jwt.ParseWithClaims(c.Value, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return j.Secret, nil
	})
	if err != nil {
		slog.Error("failed to read JWT", slog.Any("error", err))
		return nil
	}

	if claims, ok := token.Claims.(*jwt.RegisteredClaims); ok && token.Valid {
		if id, _ := strconv.ParseInt(claims.ID, 10, 64); id > 0 {
			return &id
		}
	}

	return nil
}
