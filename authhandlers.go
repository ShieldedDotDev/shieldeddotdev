package shieldeddotdev

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gofrs/uuid"
	"github.com/google/go-github/v28/github"
	"golang.org/x/oauth2"
	goauth "golang.org/x/oauth2/github"
)

type GitHubAuthHandler struct {
	um     *model.UserMapper
	config *oauth2.Config
}

func NewGitHubAuthHandler(um *model.UserMapper, clientID string, clientSecret string) *GitHubAuthHandler {
	conf := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Scopes:       []string{"user:email"},
		Endpoint:     goauth.Endpoint,
	}

	return &GitHubAuthHandler{
		um:     um,
		config: conf,
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

	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}
