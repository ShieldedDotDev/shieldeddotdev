package shieldeddotdev

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGitHubLoginStateCookieIsHardened(t *testing.T) {
	h := NewGitHubAuthHandler(nil, "client-id", "client-secret", &JwtAuth{})
	w := httptest.NewRecorder()

	h.LoginHandler(w, httptest.NewRequest(http.MethodGet, "/github/login", nil))

	if w.Code != http.StatusTemporaryRedirect {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusTemporaryRedirect)
	}

	assertHardenedCookie(t, w.Result().Cookies(), "gh-auth-state")
}

func TestAuthorizationCookieIsHardened(t *testing.T) {
	j := &JwtAuth{Secret: []byte("test-secret")}
	w := httptest.NewRecorder()

	if err := j.Authorize(w, 1); err != nil {
		t.Fatalf("Authorize() error = %v", err)
	}

	assertHardenedCookie(t, w.Result().Cookies(), "auth")
}

func assertHardenedCookie(t *testing.T, cookies []*http.Cookie, name string) {
	t.Helper()

	for _, cookie := range cookies {
		if cookie.Name != name {
			continue
		}

		if !cookie.Secure {
			t.Error("Secure = false, want true")
		}
		if !cookie.HttpOnly {
			t.Error("HttpOnly = false, want true")
		}
		if cookie.SameSite != http.SameSiteLaxMode {
			t.Errorf("SameSite = %v, want %v", cookie.SameSite, http.SameSiteLaxMode)
		}
		if cookie.Domain != "" {
			t.Errorf("Domain = %q, want host-only cookie", cookie.Domain)
		}

		return
	}

	t.Fatalf("%q cookie not found", name)
}
