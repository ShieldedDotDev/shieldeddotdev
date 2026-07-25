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
	tm      *model.UserAPITokenMapper
	imgHost string
}

func NewApiHandler(sm *model.ShieldMapper, tm *model.UserAPITokenMapper, imgHost string) *ApiHandler {
	return &ApiHandler{sm: sm, tm: tm, imgHost: imgHost}
}

func (ah *ApiHandler) HandlePOST(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		slog.Error("error parsing form", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	for k := range r.Form {
		if k != "id" && k != "title" && k != "text" && k != "color" {
			http.Error(w, "invalid field: "+k, http.StatusBadRequest)
			return
		}
	}

	userShieldID, hasUserShieldID := r.Form["id"]
	if hasUserShieldID {
		ah.handleUserTokenPOST(w, r, userShieldID)
		return
	}

	ah.handleShieldTokenPOST(w, r)
}

func (ah *ApiHandler) handleUserTokenPOST(w http.ResponseWriter, r *http.Request, userShieldIDs []string) {
	if len(userShieldIDs) != 1 || userShieldIDs[0] == "" || !validUserShieldID(userShieldIDs[0]) {
		http.Error(w, "id must be 5-64 lowercase letters, digits, or hyphens", http.StatusBadRequest)
		return
	}

	token, ok := apiRequestToken(w, r)
	if !ok {
		return
	}
	if !model.IsUserAPIToken(token) {
		http.Error(w, "id requires a user token", http.StatusBadRequest)
		return
	}

	userToken, err := ah.tm.GetFromToken(token)
	if err != nil {
		slog.Error("error fetching user API token", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if userToken == nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}
	if err := ah.tm.MarkUsed(userToken.APITokenID); err != nil {
		slog.Error("error recording user API token use", slog.Any("error", err), slog.Int64("api_token_id", userToken.APITokenID))
	}

	shield, err := ah.sm.GetFromUserIDAndUserShieldID(userToken.UserID, userShieldIDs[0])
	if err != nil {
		slog.Error("error fetching shield from user API token", slog.Any("error", err), slog.Int64("user_id", userToken.UserID))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	created := shield == nil
	if created {
		defaultColor, err := NormalizeColor("green")
		if err != nil {
			slog.Error("error selecting default shield color", slog.Any("error", err))
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		secret, err := secureStringWithCharset(40, "abcdefghjkmnpqrstuvwxyz23456789")
		if err != nil {
			slog.Error("error generating shield secret", slog.Any("error", err))
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		shield = &model.Shield{
			UserID:       userToken.UserID,
			UserShieldID: userShieldIDs[0],
			Name:         userShieldIDs[0],
			Title:        userShieldIDs[0],
			Color:        defaultColor,
			Secret:       secret,
		}
	}

	ah.saveShieldFromForm(w, r, shield, created)
}

func (ah *ApiHandler) handleShieldTokenPOST(w http.ResponseWriter, r *http.Request) {
	token, ok := apiRequestToken(w, r)
	if !ok {
		return
	}
	if model.IsUserAPIToken(token) {
		http.Error(w, "user token requires an id", http.StatusBadRequest)
		return
	}

	shield, err := ah.sm.GetFromSecret(token)
	if err != nil {
		slog.Error("error fetching shield from secret", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if shield == nil {
		slog.Info("shield not found")
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	ah.saveShieldFromForm(w, r, shield, false)
}

func apiRequestToken(w http.ResponseWriter, r *http.Request) (string, bool) {
	authParts := strings.SplitN(r.Header.Get("Authorization"), " ", 2)
	if len(authParts) != 2 || authParts[0] != "token" {
		http.Error(w, "missing secret", http.StatusBadRequest)
		return "", false
	}
	return authParts[1], true
}

func (ah *ApiHandler) saveShieldFromForm(w http.ResponseWriter, r *http.Request, shield *model.Shield, created bool) {
	var err error

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

	err = ah.sm.Save(shield)
	if err != nil {
		slog.Error("error saving shield", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if created {
		w.WriteHeader(http.StatusCreated)
	}
	json.NewEncoder(w).Encode(map[string]string{
		"ShieldURL": "https://" + ah.imgHost + "/s/" + shield.PublicID,
	})
}
