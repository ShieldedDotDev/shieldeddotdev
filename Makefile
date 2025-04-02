BIN=shielded
BIN_DEBUG=$(BIN)-debug

USER=$(shell whoami)
HEAD=$(shell ([ -n "$${CI_TAG}" ] && echo "$$CI_TAG" || exit 1) || git describe --tags 2> /dev/null || git rev-parse --short HEAD)
STAMP=$(shell date -u '+%Y-%m-%d_%I:%M:%S%p')
DIRTY=$(shell test $(shell git status --porcelain | wc -l) -eq 0 || echo '(dirty)')

BUILDTAGS=""
LDADDIT=""
LDFLAGS="-X main.buildStamp=$(STAMP) -X main.buildUser=$(USER) -X main.buildHash=$(HEAD) -X main.buildDirty=$(DIRTY) $(LDADDIT)"

TEMPLATES_DIR = ./pages
STATIC_DIR = ./static
STATIC_SOURCES = $(STATIC_DIR)/style/style.css $(STATIC_DIR)/main.js $(STATIC_DIR)/index.html $(STATIC_DIR)/dashboard.html
RELEASE_DIR = ./release
DIST_DIR = ./dist

.PHONY: build
build: $(BIN)

.PHONY: deps
deps:
	npm install

.PHONY: clean
clean:
	-rm $(BIN) $(BIN_DEBUG) 
	-rm $(STATIC_SOURCES)
	-rm -rf $(RELEASE_DIR) $(DIST_DIR)
	find ts -name "*.js" -type f -print0 | xargs -0 /bin/rm -f

$(BIN): go.mod go.sum $(STATIC_SOURCES)
	echo $(LDFLAGS)
	go build -tags $(BUILDTAGS) -ldflags $(LDFLAGS) -o $(BIN) ./cmd/shielded


$(RELEASE_DIR)/linux_amd64/$(BIN): go.mod go.sum $(STATIC_SOURCES)
	GOOS=linux GOARCH=amd64 go build -tags $(BUILDTAGS) -ldflags $(LDFLAGS) -o $(RELEASE_DIR)/linux_amd64/$(BIN) ./cmd/shielded

$(RELEASE_DIR)/darwin_amd64/$(BIN): go.mod go.sum $(STATIC_SOURCES)
	GOOS=darwin GOARCH=amd64 go build -tags $(BUILDTAGS) -ldflags $(LDFLAGS) -o $(RELEASE_DIR)/darwin_amd64/$(BIN) ./cmd/shielded

$(RELEASE_DIR)/darwin_arm64/$(BIN): go.mod go.sum $(STATIC_SOURCES)
	GOOS=darwin GOARCH=arm64 go build -tags $(BUILDTAGS) -ldflags $(LDFLAGS) -o $(RELEASE_DIR)/darwin_arm64/$(BIN) ./cmd/shielded

$(RELEASE_DIR)/windows_amd64/$(BIN).exe: go.mod go.sum $(STATIC_SOURCES)
	GOOS=windows GOARCH=amd64 go build -tags $(BUILDTAGS) -ldflags $(LDFLAGS) -o $(RELEASE_DIR)/windows_amd64/$(BIN).exe ./cmd/shielded

.PHONY: $(RELEASE_DIR)
$(RELEASE_DIR): clean $(RELEASE_DIR)/linux_amd64/$(BIN) $(RELEASE_DIR)/darwin_amd64/$(BIN) $(RELEASE_DIR)/darwin_arm64/$(BIN) $(RELEASE_DIR)/windows_amd64/$(BIN).exe
	mkdir $(DIST_DIR)
	zip -j 'dist/$(BIN)_$(HEAD)_linux_amd64.zip' $(RELEASE_DIR)/linux_amd64/$(BIN)
	zip -j 'dist/$(BIN)_$(HEAD)_darwin_amd64.zip' $(RELEASE_DIR)/darwin_amd64/$(BIN)
	zip -j 'dist/$(BIN)_$(HEAD)_darwin_arm64.zip' $(RELEASE_DIR)/darwin_arm64/$(BIN)
	zip -j 'dist/$(BIN)_$(HEAD)_windows_amd64.zip' $(RELEASE_DIR)/windows_amd64/$(BIN).exe
	
.PHONY: lint
lint:
	./node_modules/.bin/tslint -c tslint.json ts/**/*.ts --fix 

.PHONY: debug
debug: clean $(STATIC_SOURCES) $(STATIC_DIR)/main.js
	$(MAKE) BIN=$(BIN_DEBUG) BUILDTAGS="debug" LDADDIT="-X main.rootHost=local.shielded.dev -X main.apiHost=api.local.shielded.dev -X main.imgHost=img.local.shielded.dev" build
	./$(BIN_DEBUG) -run-local=true

$(STATIC_DIR)/style/style.css: $(shell find scss -name "*.scss")
	npx sass scss:static/style

$(STATIC_DIR)/main.js: $(shell find ts -name "*.ts") rollup.config.js tsconfig.json
	npx rollup --config rollup.config.js

$(STATIC_DIR)/index.html $(STATIC_DIR)/dashboard.html: $(shell find $(TEMPLATES_DIR) -name "*.php")
	$(foreach file, $(wildcard $(TEMPLATES_DIR)/*.html.php), php $(file) > $(STATIC_DIR)/$$(basename $(file) | sed 's/\.[^.]*$$//'); )
	npx html-minifier-terser --input-dir static --output-dir static --file-ext html --collapse-whitespace --conservative-collapse
