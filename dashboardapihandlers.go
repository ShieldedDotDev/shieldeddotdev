package shieldeddotdev

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gorilla/mux"
)

type DashboardShieldApiIndexHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewDashboardShieldApiIndexHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *DashboardShieldApiIndexHandler {
	return &DashboardShieldApiIndexHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (sh *DashboardShieldApiIndexHandler) HandleGET(w http.ResponseWriter, r *http.Request) {
	id := sh.jwtAuth.GetAuth(r)
	if id == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	shields, err := sh.sm.GetFromUserID(*id)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	enc := json.NewEncoder(w)
	err = enc.Encode(shields)
	if err != nil {
		log.Println(err)
	}
}

func (sh *DashboardShieldApiIndexHandler) HandlePOST(w http.ResponseWriter, r *http.Request) {
	id := sh.jwtAuth.GetAuth(r)
	if id == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	postShield := &model.Shield{}

	jd := json.NewDecoder(r.Body)
	err := jd.Decode(postShield)
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest)
		return
	}

	uu := stringWithCharset(40, "abcdefghjkmnpqrstuvwxyz23456789")

	cleanShield := &model.Shield{
		UserID: *id,

		Name: postShield.Name,

		Title: postShield.Title,
		Text:  postShield.Text,
		Color: postShield.Color,

		Secret: uu,
	}

	err = sh.sm.Save(cleanShield)
	if err != nil {
		log.Println(err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("/api/shields/%d", cleanShield.ShieldID))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	x := json.NewEncoder(w)
	x.Encode(cleanShield)
}

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

func stringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

type DashboardShieldApiHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewDashboardShieldApiHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *DashboardShieldApiHandler {
	return &DashboardShieldApiHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (dh *DashboardShieldApiHandler) shieldSetup(w http.ResponseWriter, r *http.Request) *model.Shield {
	uid := dh.jwtAuth.GetAuth(r)
	if uid == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return nil
	}

	vars := mux.Vars(r)
	id, suc := vars["id"]
	if !suc {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return nil
	}

	nid, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return nil
	}

	shield, err := dh.sm.GetFromUserIDAndID(*uid, nid)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return nil
	}

	if shield == nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return nil
	}

	return shield
}

func (dh *DashboardShieldApiHandler) HandlePUT(w http.ResponseWriter, r *http.Request) {
	shield := dh.shieldSetup(w, r)
	if shield == nil {
		return
	}

	putShield := &model.Shield{}
	jd := json.NewDecoder(r.Body)
	err := jd.Decode(putShield)
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest)
		return
	}

	shield.Name = putShield.Name

	shield.Title = putShield.Title
	shield.Text = putShield.Text
	shield.Color = putShield.Color

	err = dh.sm.Save(shield)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	x := json.NewEncoder(w)
	x.Encode(shield)
}

func (sah *DashboardShieldApiHandler) HandleDELETE(w http.ResponseWriter, r *http.Request) {
	shield := sah.shieldSetup(w, r)
	if shield == nil {
		return
	}

	err := sah.sm.Delete(shield)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
