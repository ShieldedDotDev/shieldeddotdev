package model

import (
	"crypto/sha256"
	"strings"
	"testing"
)

func TestNewUserAPITokenSecret(t *testing.T) {
	plainToken, tokenHash, err := newUserAPITokenSecret()
	if err != nil {
		t.Fatal(err)
	}

	if !strings.HasPrefix(plainToken, UserAPITokenPrefix) {
		t.Fatalf("token %q does not have prefix %q", plainToken, UserAPITokenPrefix)
	}
	if tokenHash != sha256.Sum256([]byte(plainToken)) {
		t.Fatal("token hash does not match plaintext token")
	}
}

func TestIsUserAPIToken(t *testing.T) {
	if !IsUserAPIToken("sdu_current") {
		t.Fatal("user API token was not recognized")
	}
	if IsUserAPIToken("shield-secret") {
		t.Fatal("per-shield token was recognized as a user API token")
	}
}
