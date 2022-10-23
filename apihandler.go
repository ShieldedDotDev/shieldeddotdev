package shieldeddotdev

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
)

type ApiHandler struct {
	sm      *model.ShieldMapper
	imgHost string
}

func NewApiHandler(sm *model.ShieldMapper, imgHost string) *ApiHandler {
	return &ApiHandler{sm, imgHost}
}

func (ah *ApiHandler) HandlePOST(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	authParts := strings.SplitN(auth, " ", 2)
	if len(authParts) != 2 || authParts[0] != "token" {
		http.Error(w, "missing secret", http.StatusBadRequest)
		return
	}

	shield, err := ah.sm.GetFromSecret(authParts[1])
	if err != nil {
		log.Println("error fetching shield from secret: ", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if shield == nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	err = r.ParseForm()
	if err != nil {
		log.Println("error parsing form: ", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if title := r.FormValue("title"); title != "" {
		shield.Title = title
	}
	if text := r.FormValue("text"); text != "" {
		shield.Text = text
	}
	if color := r.FormValue("color"); color != "" {
		shield.Color = color
	}

	for k := range r.Form {
		if k != "title" && k != "text" && k != "color" {
			http.Error(w, "invalid field: "+k, http.StatusBadRequest)
			return
		}
	}

	err = ah.sm.Save(shield)
	if err != nil {
		log.Println("error fetching shield from secret: ", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"ShieldURL": "https://" + ah.imgHost + "/s/" + shield.PublicID,
	})
}
