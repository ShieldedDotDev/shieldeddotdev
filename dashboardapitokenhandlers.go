package shieldeddotdev

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
	"github.com/gorilla/mux"
)

type DashboardUserAPITokenIndexHandler struct {
	tm      *model.UserAPITokenMapper
	jwtAuth *JwtAuth
}

func NewDashboardUserAPITokenIndexHandler(tm *model.UserAPITokenMapper, jwtAuth *JwtAuth) *DashboardUserAPITokenIndexHandler {
	return &DashboardUserAPITokenIndexHandler{
		tm:      tm,
		jwtAuth: jwtAuth,
	}
}

func (th *DashboardUserAPITokenIndexHandler) HandleGET(w http.ResponseWriter, r *http.Request) {
	userID := th.jwtAuth.GetAuth(r)
	if userID == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	tokens, err := th.tm.GetFromUserID(*userID)
	if err != nil {
		slog.Error("error fetching API tokens", slog.Any("error", err), slog.Int64("user_id", *userID))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tokens); err != nil {
		slog.Error("error encoding API tokens", slog.Any("error", err))
	}
}

func (th *DashboardUserAPITokenIndexHandler) HandlePOST(w http.ResponseWriter, r *http.Request) {
	userID := th.jwtAuth.GetAuth(r)
	if userID == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	request := struct {
		Description string
	}{}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest)
		return
	}

	token, plainToken, err := th.tm.Create(*userID, request.Description)
	if errors.Is(err, model.ErrUserAPITokenDescriptionRequired) || errors.Is(err, model.ErrUserAPITokenDescriptionTooLong) {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err != nil {
		slog.Error("error creating API token", slog.Any("error", err), slog.Int64("user_id", *userID))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", "/user/tokens/"+strconv.FormatInt(token.APITokenID, 10))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(struct {
		*model.UserAPIToken
		Token string
	}{
		UserAPIToken: token,
		Token:        plainToken,
	}); err != nil {
		slog.Error("error encoding created API token", slog.Any("error", err))
	}
}

type DashboardUserAPITokenHandler struct {
	tm      *model.UserAPITokenMapper
	jwtAuth *JwtAuth
}

func NewDashboardUserAPITokenHandler(tm *model.UserAPITokenMapper, jwtAuth *JwtAuth) *DashboardUserAPITokenHandler {
	return &DashboardUserAPITokenHandler{
		tm:      tm,
		jwtAuth: jwtAuth,
	}
}

func (th *DashboardUserAPITokenHandler) HandleDELETE(w http.ResponseWriter, r *http.Request) {
	userID := th.jwtAuth.GetAuth(r)
	if userID == nil {
		http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
		return
	}

	apiTokenID, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
	if err != nil || apiTokenID < 1 {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	token, err := th.tm.GetFromUserIDAndID(*userID, apiTokenID)
	if err != nil {
		slog.Error("error fetching API token for deletion", slog.Any("error", err), slog.Int64("user_id", *userID), slog.Int64("api_token_id", apiTokenID))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if token == nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	if err := th.tm.DeleteFromUserIDAndID(*userID, apiTokenID); err != nil {
		slog.Error("error deleting API token", slog.Any("error", err), slog.Int64("user_id", *userID), slog.Int64("api_token_id", apiTokenID))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
