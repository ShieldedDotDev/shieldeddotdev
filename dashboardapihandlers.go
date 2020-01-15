package shieldeddotdev

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gofrs/uuid"
	"github.com/gorilla/mux"
)

type ShieldApiIndexHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewShieldApiIndexHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *ShieldApiIndexHandler {
	return &ShieldApiIndexHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (sh *ShieldApiIndexHandler) HandleGET(w http.ResponseWriter, r *http.Request) {
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

func (sh *ShieldApiIndexHandler) HandlePOST(w http.ResponseWriter, r *http.Request) {
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

	uu, err := uuid.NewV4()
	if err != nil {
		http.Error(w, "failed to generate secret", http.StatusInternalServerError)
		return
	}

	cleanShield := &model.Shield{
		UserID: *id,

		Name: postShield.Name,

		Title: postShield.Title,
		Text:  postShield.Text,
		Color: postShield.Color,

		Secret: uu.String(),
	}

	err = sh.sm.Save(cleanShield)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("/api/shields/%d", cleanShield.ShieldID))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	x := json.NewEncoder(w)
	x.Encode(cleanShield)
}

type ShieldApiHandler struct {
	sm      *model.ShieldMapper
	jwtAuth *JwtAuth
}

func NewShieldApiHandler(sm *model.ShieldMapper, jwtAuth *JwtAuth) *ShieldApiHandler {
	return &ShieldApiHandler{
		sm:      sm,
		jwtAuth: jwtAuth,
	}
}

func (dh *ShieldApiHandler) shieldSetup(w http.ResponseWriter, r *http.Request) *model.Shield {
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

func (dh *ShieldApiHandler) HandlePUT(w http.ResponseWriter, r *http.Request) {
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

func (sah *ShieldApiHandler) HandleDELETE(w http.ResponseWriter, r *http.Request) {
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
