package shieldeddotdev

import "testing"

func TestValidShieldAPIID(t *testing.T) {
	tests := []struct {
		name  string
		apiID string
		valid bool
	}{
		{name: "empty is optional", apiID: "", valid: true},
		{name: "minimum length", apiID: "abcd-", valid: true},
		{name: "maximum length", apiID: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", valid: true},
		{name: "too short", apiID: "abcd", valid: false},
		{name: "too long", apiID: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", valid: false},
		{name: "uppercase", apiID: "Release-1", valid: false},
		{name: "underscore", apiID: "release_1", valid: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := validShieldAPIID(test.apiID); got != test.valid {
				t.Errorf("validShieldAPIID(%q) = %t, want %t", test.apiID, got, test.valid)
			}
		})
	}
}
