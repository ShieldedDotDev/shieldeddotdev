package main

import "fmt"

// Do not alter - these are populated by the compiler
var (
	buildStamp = ""
	buildUser  = ""
	buildHash  = ""
	buildDirty = ""

	buildString = fmt.Sprintf("%s @ %s %s%s", buildUser, buildStamp, buildHash, buildDirty)
)

var (
	rootHost = "shielded.dev"
	apiHost  = "api.shielded.dev"
	imgHost  = "img.shielded.dev"
)
