package shieldeddotdev

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/davecgh/go-spew/spew"
)

type DashboardHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewDashboardHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *DashboardHandler {
	return &DashboardHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (dh *DashboardHandler) HandleGET(w http.ResponseWriter, r *http.Request) {
	id := dh.jwtAuth.GetAuth(r)
	if id == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	shields, err := dh.sm.GetFromUserID(*id)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	enc := json.NewEncoder(w)
	err = enc.Encode(shields)
	spew.Dump(shields)
	if err != nil {
		log.Println(err)
	}
}
