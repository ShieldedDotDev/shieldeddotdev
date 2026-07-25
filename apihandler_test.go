package shieldeddotdev

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestApiHandlerRejectsIDFormField(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader("id=production-status"))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	response := httptest.NewRecorder()

	(&ApiHandler{}).HandlePOST(response, req)

	if response.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
}

func TestApiHandlerValidatesShieldKeyBeforeAuthentication(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader("shield_key=bad"))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	response := httptest.NewRecorder()

	(&ApiHandler{}).HandlePOST(response, req)

	if response.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
	if got, want := response.Body.String(), "shield_key must be 5-64 lowercase letters, digits, or hyphens\n"; got != want {
		t.Errorf("body = %q, want %q", got, want)
	}
}
