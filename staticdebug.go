package shieldeddotdev

import (
	"io/fs"
	"os"
)

// StaticAssets is a static site asset filesystem
var StaticAssets fs.FS = os.DirFS("static")
