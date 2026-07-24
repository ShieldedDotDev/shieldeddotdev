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
	auth := r.Header.Get("Authorization")
	authParts := strings.SplitN(auth, " ", 2)
	if len(authParts) != 2 || authParts[0] != "token" {
		http.Error(w, "missing secret", http.StatusBadRequest)
		return
	}

	var shield *model.Shield
	var userToken *model.UserAPIToken
	created := false
	var err error

	if model.IsUserAPIToken(authParts[1]) {
		userToken, err = ah.tm.GetFromToken(authParts[1])
		if err != nil {
			slog.Error("error fetching user API token", slog.Any("error", err))
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		if userToken == nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		userShieldID := r.Header.Get("X-Shielded-Shield-ID")
		if !validUserShieldID(userShieldID) || userShieldID == "" {
			http.Error(w, "X-Shielded-Shield-ID must be 5-64 lowercase letters, digits, or hyphens", http.StatusBadRequest)
			return
		}

		shield, err = ah.sm.GetFromUserIDAndUserShieldID(userToken.UserID, userShieldID)
		if err != nil {
			slog.Error("error fetching shield from user API token", slog.Any("error", err), slog.Int64("user_id", userToken.UserID))
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		if shield == nil {
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
				UserShieldID: userShieldID,
				Name:         userShieldID,
				Title:        userShieldID,
				Color:        defaultColor,
				Secret:       secret,
			}
			created = true
		}
	} else {
		shield, err = ah.sm.GetFromSecret(authParts[1])
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
	}

	err = r.ParseForm()
	if err != nil {
		slog.Error("error parsing form", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	for k := range r.Form {
		if k != "title" && k != "text" && k != "color" {
			http.Error(w, "invalid field: "+k, http.StatusBadRequest)
			return
		}
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

	err = ah.sm.Save(shield)
	if err != nil {
		slog.Error("error saving shield", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if userToken != nil {
		if err := ah.tm.MarkUsed(userToken.APITokenID); err != nil {
			slog.Error("error recording user API token use", slog.Any("error", err), slog.Int64("api_token_id", userToken.APITokenID))
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if created {
		w.WriteHeader(http.StatusCreated)
	}
	json.NewEncoder(w).Encode(map[string]string{
		"ShieldURL": "https://" + ah.imgHost + "/s/" + shield.PublicID,
	})
}
