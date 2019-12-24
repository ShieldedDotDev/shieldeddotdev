package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/google/go-github/v28/github"
	"github.com/gorilla/mux"
	"github.com/mholt/certmagic"
	"golang.org/x/oauth2"
	githuboauth "golang.org/x/oauth2/github"
)

var (
	clientID     = flag.String("client-id", "", "GitHub Oauth ClientID")
	clientSecret = flag.String("client-secret", "", "GitHub Oauth ClientSecret")
)

func init() {
	flag.Parse()
}

func main() {

	oauthConf := &oauth2.Config{
		ClientID:     *clientID,
		ClientSecret: *clientSecret,
		Scopes:       []string{"user:email"},
		Endpoint:     githuboauth.Endpoint,
	}
	// random string for oauth2 API calls to protect against CSRF
	oauthStateString := "thisshouldberandom"

	ro := mux.NewRouter()
	ro.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("api"))
	}).Host("api.shielded.dev")

	ro.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("img"))
	}).Host("img.shielded.dev")

	wo := mux.NewRouter()
	ro.PathPrefix("/").Handler(wo)

	wo.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("www"))
	})

	wo.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		url := oauthConf.AuthCodeURL(oauthStateString, oauth2.AccessTypeOnline)
		http.Redirect(w, r, url, http.StatusTemporaryRedirect)
	})

	wo.HandleFunc("/github/callback", func(w http.ResponseWriter, r *http.Request) {
		state := r.FormValue("state")
		if state != oauthStateString {
			fmt.Printf("invalid oauth state, expected '%s', got '%s'\n", oauthStateString, state)
			http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
			return
		}

		code := r.FormValue("code")
		token, err := oauthConf.Exchange(oauth2.NoContext, code)
		if err != nil {
			fmt.Printf("oauthConf.Exchange() failed with '%s'\n", err)
			http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
			return
		}

		oauthClient := oauthConf.Client(oauth2.NoContext, token)
		client := github.NewClient(oauthClient)
		user, _, err := client.Users.Get(oauth2.NoContext, "")
		if err != nil {
			fmt.Printf("client.Users.Get() failed with '%s'\n", err)
			http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
			return
		}
		fmt.Printf("Logged in as GitHub user: %s\n", *user.Login)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	})

	err := certmagic.HTTPS([]string{"shielded.dev", "www.shielded.dev", "api.shielded.dev", "img.shielded.dev"}, ro)
	if err != nil {
		log.Fatal(err)
	}
}
