// +build !debug

package shieldeddotdev

import (
	"embed"
	"io/fs"
)

//go:embed static
var static embed.FS

func init() {
	sa, err := fs.Sub(static, "static")
	if err != nil {
		panic(err)
	}

	StaticAssets = sa
}
