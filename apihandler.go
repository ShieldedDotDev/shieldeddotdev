package shieldeddotdev

import (
	"encoding/json"
	"log/slog"
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
		slog.Error("error fetching shield from secret", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if shield == nil {
		slog.Info("shield not found", slog.String("secret", authParts[1]))
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	err = r.ParseForm()
	if err != nil {
		slog.Error("error parsing form", slog.Any("error", err))
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
		color, err := NormalizeColor(color)
		if err != nil {
			slog.Error("error normalizing color", slog.Any("error", err))
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}
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
		slog.Error("error saving shield", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"ShieldURL": "https://" + ah.imgHost + "/s/" + shield.PublicID,
	})
}
