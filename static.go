package shieldeddotdev

import (
	"embed"
	"io/fs"
)

//go:embed static
var static embed.FS

// StaticAssets is a static site asset filesystem
var StaticAssets fs.FS

func init() {
	sa, err := fs.Sub(static, "static")
	if err != nil {
		panic(err)
	}

	StaticAssets = sa
}
