package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"

	"github.com/ShieldedDotDev/shieldeddotdev"
	"github.com/ShieldedDotDev/shieldeddotdev/model"

	"github.com/davecgh/go-spew/spew"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/mholt/certmagic"
)

type Subdomains struct {
	root string
	api  string
	img  string
}

var (
	dsn          = flag.String("dsn", "admin:password@tcp(127.0.0.1:3306)/shielded?parseTime=true", "MySQL DSN")
	clientID     = flag.String("client-id", "", "GitHub Oauth ClientID")
	clientSecret = flag.String("client-secret", "", "GitHub Oauth ClientSecret")

	// cookieSecret = flag.String("cookie-secret", "", "Secret used to hash cookies")

	runLocal = flag.Bool("local", false, "Run as local dev setup")

	subdomains = Subdomains{
		root: "shielded.dev",
		api:  "api.shielded.dev",
		img:  "img.shielded.dev",
	}
)

func init() {
	flag.Parse()

	if *runLocal {
		subdomains = Subdomains{
			root: "local.shielded.dev",
			api:  "local.api.shielded.dev",
			img:  "local.img.shielded.dev",
		}
	}
}

func main() {
	spew.Dump(subdomains)

	db, err := sql.Open("mysql", *dsn)
	if err != nil {
		log.Fatal(err)
	}

	um := model.NewUserMapper(db)
	sm := model.NewShieldMapper(db)

	ro := mux.NewRouter()
	ro.PathPrefix("/").Host("www." + subdomains.root).Handler(
		http.RedirectHandler("https://"+subdomains.root, http.StatusPermanentRedirect))

	ao := ro.Host(subdomains.api).Subrouter()
	ao.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("api"))
	})

	io := ro.Host(subdomains.img).Subrouter()
	io.Handle("/s/{id:[0-9]+}", shieldeddotdev.NewShieldHandler(sm))

	wo := ro.Host(subdomains.root).Subrouter()

	wo.HandleFunc("/funk", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("fresh"))
	})

	ah := shieldeddotdev.NewGitHubAuthHandler(um, *clientID, *clientSecret)
	wo.HandleFunc("/github/login", ah.LoginHandler)
	wo.HandleFunc("/github/callback", ah.CallbackHandler)

	wo.PathPrefix("/").Handler(http.FileServer(shieldeddotdev.AssetFile()))

	if *runLocal {
		err = http.ListenAndServe(":8686", ro)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		err = certmagic.HTTPS([]string{subdomains.root, "www." + subdomains.root, subdomains.api, subdomains.img}, ro)
		if err != nil {
			log.Fatal(err)
		}
	}

}
