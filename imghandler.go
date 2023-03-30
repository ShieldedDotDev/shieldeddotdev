package shieldeddotdev

import (
	"log"
	"net/http"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gorilla/mux"
	"github.com/narqo/go-badge"
)

type ShieldHandler struct {
	sm *model.ShieldMapper
}

func NewShieldHandler(sm *model.ShieldMapper) *ShieldHandler {
	return &ShieldHandler{sm}
}

func (sh *ShieldHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idst := vars["pid"]

	s, err := sh.sm.GetFromPublicID(idst)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if s == nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "image/svg+xml")
	w.Header().Set("Cache-Control", "no-cache")

	err = badge.Render(s.Title, s.Text, badge.Color("#"+s.Color), w)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

type StaticShieldHandler struct{}

func (ssh *StaticShieldHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Query().Get("title")
	text := r.URL.Query().Get("text")
	color := r.URL.Query().Get("color")
	if color == "" {
		color = "green"
	}

	normalizedColor, err := NormalizeColor(color)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	log.Println(color, normalizedColor)

	w.Header().Set("Content-Type", "image/svg+xml")
	w.Header().Set("Cache-Control", "no-cache")

	err = badge.Render(title, text, badge.Color("#"+normalizedColor), w)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
