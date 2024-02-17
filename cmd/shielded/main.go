package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"log"
	"log/slog"
	"net/http"
	"os"
	"strconv"

	"github.com/NYTimes/gziphandler"
	"github.com/ShieldedDotDev/shieldeddotdev"
	"github.com/ShieldedDotDev/shieldeddotdev/model"

	"github.com/caddyserver/certmagic"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gofrs/uuid"
	"github.com/gorilla/mux"
)

var (
	dsn          = flag.String("dsn", "admin:password@tcp(127.0.0.1:3306)/shielded?parseTime=true", "MySQL DSN")
	clientID     = flag.String("client-id", "", "GitHub Oauth ClientID")
	clientSecret = flag.String("client-secret", "", "GitHub Oauth ClientSecret")

	// cookieSecret = flag.String("cookie-secret", "", "Secret used to hash cookies")

	runLocal  = flag.Bool("run-local", true, "Run in local development mode")
	localAddr = flag.String("local-addr", ":8686", "Local address to listen on")

	logSource = flag.Bool("log-source", false, "log output includes source code location")
)

func init() {
	flag.Parse()
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		AddSource: *logSource,
	})))

	slog.Info("starting up",
		slog.String("build", buildString),
		slog.String("root", rootHost),
		slog.String("api", apiHost),
		slog.String("img", imgHost))

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
	apih := shieldeddotdev.NewApiHandler(sm, imgHost)
	ao.HandleFunc("/", apih.HandlePOST)

	io := ro.Host(imgHost).Subrouter()
	io.Handle("/s/{pid:[a-z0-9]{3,128}}", shieldeddotdev.NewShieldHandler(sm))
	io.Handle("/s", &shieldeddotdev.StaticShieldHandler{})

	wo := ro.Host(rootHost).Subrouter()

	uuu, err := uuid.NewV4()
	if err != nil {
		panic(err)
	}
	jwta := &shieldeddotdev.JwtAuth{Secret: uuu.Bytes()}

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

	wo.HandleFunc("/env", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"RootHost": rootHost,
			"ApiHost":  apiHost,
			"ImgHost":  imgHost,
		})
	})

	if *runLocal {
		ah := shieldeddotdev.NewDebugAuthHandler(um, jwta)
		wo.HandleFunc("/github/login", ah.LoginHandler)

		wo.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))
	} else {
		ah := shieldeddotdev.NewGitHubAuthHandler(um, *clientID, *clientSecret, jwta)
		wo.HandleFunc("/github/login", ah.LoginHandler)
		wo.HandleFunc("/github/callback", ah.CallbackHandler)

		wo.PathPrefix("/").Handler(http.FileServer(http.FS(shieldeddotdev.StaticAssets)))
	}

	if *runLocal {
		err = http.ListenAndServe(*localAddr, ro)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		err = certmagic.HTTPS([]string{rootHost, "www." + rootHost, apiHost, imgHost}, gziphandler.GzipHandler(ro))
		if err != nil {
			log.Fatal(err)
		}
	}

}
