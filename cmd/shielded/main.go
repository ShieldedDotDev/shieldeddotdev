package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"
	"strconv"

	"github.com/ShieldedDotDev/shieldeddotdev"
	"github.com/ShieldedDotDev/shieldeddotdev/model"

	"github.com/caddyserver/certmagic"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gofrs/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var (
	dsn          = flag.String("dsn", "admin:password@tcp(127.0.0.1:3306)/shielded?parseTime=true", "MySQL DSN")
	clientID     = flag.String("client-id", "", "GitHub Oauth ClientID")
	clientSecret = flag.String("client-secret", "", "GitHub Oauth ClientSecret")

	// cookieSecret = flag.String("cookie-secret", "", "Secret used to hash cookies")

	runLocal = flag.Bool("run-local", true, "Run in local development mode")
)

func init() {
	log.Println(buildString)
	log.Println(hostString)

	flag.Parse()
}

func main() {
	db, err := sql.Open("mysql", *dsn)
	if err != nil {
		log.Fatal(err)
	}

	um := model.NewUserMapper(db)
	sm := model.NewShieldMapper(db)

	ro := mux.NewRouter()
	ro.PathPrefix("/").Host("www." + rootHost).Handler(
		http.RedirectHandler("https://"+rootHost, http.StatusPermanentRedirect))

	ao := ro.Host(apiHost).Subrouter()
	apih := shieldeddotdev.NewApiHandler(sm)
	ao.HandleFunc("/", apih.HandlePOST)

	io := ro.Host(imgHost).Subrouter()
	io.Handle("/s/{id:[0-9]+}", handlers.CompressHandler(shieldeddotdev.NewShieldHandler(sm)))

	wo := ro.Host(rootHost).Subrouter()

	uuu, err := uuid.NewV4()
	if err != nil {
		panic(err)
	}
	jwta := &shieldeddotdev.JwtAuth{uuu.Bytes()}

	wo.HandleFunc("/api/authed", func(w http.ResponseWriter, r *http.Request) {
		i := jwta.GetAuth(r)
		if i == nil {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		w.Write([]byte(strconv.FormatInt(*i, 10)))
	})

	dh := shieldeddotdev.NewDashboardShieldApiIndexHandler(sm, jwta)
	wo.HandleFunc("/api/shields", dh.HandleGET).Methods("GET")
	wo.HandleFunc("/api/shields", dh.HandlePOST).Methods("POST")

	sah := shieldeddotdev.NewDashboardShieldApiHandler(sm, jwta)
	wo.HandleFunc("/api/shield/{id:[0-9]+}", sah.HandlePUT).Methods("PUT")
	wo.HandleFunc("/api/shield/{id:[0-9]+}", sah.HandleDELETE).Methods("DELETE")

	ah := shieldeddotdev.NewGitHubAuthHandler(um, *clientID, *clientSecret, jwta)
	wo.HandleFunc("/github/login", ah.LoginHandler)
	wo.HandleFunc("/github/callback", ah.CallbackHandler)

	wo.PathPrefix("/").Handler(http.FileServer(http.FS(shieldeddotdev.StaticAssets)))

	if *runLocal {
		err = http.ListenAndServe(":8686", ro)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		err = certmagic.HTTPS([]string{rootHost, "www." + rootHost, apiHost, imgHost}, ro)
		if err != nil {
			log.Fatal(err)
		}
	}

}
