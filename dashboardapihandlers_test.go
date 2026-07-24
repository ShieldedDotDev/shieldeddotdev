package shieldeddotdev

import "testing"

func TestValidUserShieldID(t *testing.T) {
	tests := []struct {
		name         string
		userShieldID string
		valid        bool
	}{
		{name: "empty is optional", userShieldID: "", valid: true},
		{name: "minimum length", userShieldID: "abcd-", valid: true},
		{name: "maximum length", userShieldID: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", valid: true},
		{name: "too short", userShieldID: "abcd", valid: false},
		{name: "too long", userShieldID: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", valid: false},
		{name: "uppercase", userShieldID: "Release-1", valid: false},
		{name: "underscore", userShieldID: "release_1", valid: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := validUserShieldID(test.userShieldID); got != test.valid {
				t.Errorf("validUserShieldID(%q) = %t, want %t", test.userShieldID, got, test.valid)
			}
		})
	}
}
