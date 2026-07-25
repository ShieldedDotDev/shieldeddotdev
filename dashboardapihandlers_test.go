package shieldeddotdev

import "testing"

func TestValidShieldKey(t *testing.T) {
	tests := []struct {
		name      string
		shieldKey string
		valid     bool
	}{
		{name: "empty is optional", shieldKey: "", valid: true},
		{name: "minimum length", shieldKey: "abcd-", valid: true},
		{name: "maximum length", shieldKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", valid: true},
		{name: "too short", shieldKey: "abcd", valid: false},
		{name: "too long", shieldKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", valid: false},
		{name: "uppercase", shieldKey: "Release-1", valid: false},
		{name: "underscore", shieldKey: "release_1", valid: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := validShieldKey(test.shieldKey); got != test.valid {
				t.Errorf("validShieldKey(%q) = %t, want %t", test.shieldKey, got, test.valid)
			}
		})
	}
}
