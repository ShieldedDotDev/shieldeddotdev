package shieldeddotdev

import (
	"net/http"

	"github.com/ShieldedDotDev/shieldeddotdev/model"
)

type ApiHandler struct {
	sm *model.ShieldMapper
}

func NewApiHandler(sm *model.ShieldMapper) *ApiHandler {
	return &ApiHandler{sm}
}

func (ah *GitHubAuthHandler) UpdateHandler(w http.ResponseWriter, r *http.Request) {
}
