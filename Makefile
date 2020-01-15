.PHONY: build
build: bindata.go
	go build ./cmd/shielded

.PHONY: debug
debug: bindata.go
	go-bindata -debug -fs -pkg shieldeddotdev -prefix "static/" static/...
	go build ./cmd/shielded
	./shielded -local=true

bindata.go: $(shell find static -type f)
	go-bindata -fs -pkg shieldeddotdev -prefix "static/" static/...

$(shell find static -name "*.css"): $(shell find scss -name "*.scss")
	compass compile

static/main.js: $(shell find ts -name "*.ts")
	./node_modules/.bin/tsc