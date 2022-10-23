package shieldeddotdev

import (
	"errors"
	"strings"

	"github.com/narqo/go-badge"
)

var ErrUnsupportedColor = errors.New("unsupported color")

func NormalizeColor(color string) (string, error) {
	color = strings.ToLower(strings.TrimSpace(color))
	if _, ok := badge.ColorScheme[color]; ok {
		return color, nil
	}

	color = strings.TrimPrefix(color, "#")

	if clen := len(color); clen != 6 && clen != 3 {
		return color, ErrUnsupportedColor
	}
	for _, ch := range color {
		if (ch < '0' || ch > '9') && (ch < 'a' || ch > 'f') {
			return color, ErrUnsupportedColor
		}
	}

	return color, nil
}
