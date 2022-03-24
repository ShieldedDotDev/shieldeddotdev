package shieldeddotdev

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt"
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
		log.Printf("Failed to sign jwt: %s\n", err)
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
		log.Println("missing auth-state cookie")
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	state := r.FormValue("state")
	if state != c.Value {
		log.Printf("invalid oauth state, expected '%s', got '%s'\n", c.Value, state)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	code := r.FormValue("code")
	token, err := ah.config.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("ah.config.Exchange() failed with '%s'\n", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	oauthClient := ah.config.Client(oauth2.NoContext, token)
	client := github.NewClient(oauthClient)
	user, _, err := client.Users.Get(context.Background(), "")
	if err != nil {
		log.Printf("client.Users.Get() failed with '%s'\n", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	log.Printf("Logged in as GitHub user: %s - %s : %d\n", *user.Login, *user.Email, *user.ID)
	err = ah.um.Save(&model.User{
		UserID: *user.ID,
		Login:  *user.Login,
		Email:  *user.Email,
	})

	if err != nil {
		log.Printf("Failed to record credentials: %s\n", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	err = ah.jwtAuth.Authorize(w, *user.ID)
	if err != nil {
		log.Printf("Failed to sign jwt: %s\n", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	http.Redirect(w, r, "/dashboard.html", http.StatusTemporaryRedirect)
}

type JwtAuth struct {
	Secret []byte
}

func (j *JwtAuth) Authorize(w http.ResponseWriter, uid int64) error {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Id: strconv.FormatInt(uid, 10),
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

	token, err := jwt.ParseWithClaims(c.Value, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return j.Secret, nil
	})
	if err != nil {
		log.Printf("failed to read JWT: %s\n", err)
		return nil
	}

	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		if id, _ := strconv.ParseInt(claims.Id, 10, 64); id > 0 {
			return &id
		}
	}

	return nil
}
