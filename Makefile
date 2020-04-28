BIN=shielded

USER=$(shell whoami)
HEAD=$(shell ([ -n "$${CI_TAG}" ] && echo "$$CI_TAG" || exit 1) || git describe --tags 2> /dev/null || git rev-parse --short HEAD)
STAMP=$(shell date -u '+%Y-%m-%d_%I:%M:%S%p')
DIRTY=$(shell test $(shell git status --porcelain | wc -l) -eq 0 || echo '(dirty)')

LDADDIT=""
LDFLAGS="-X main.buildStamp=$(STAMP) -X main.buildUser=$(USER) -X main.buildHash=$(HEAD) -X main.buildDirty=$(DIRTY) $(LDADDIT)"

TEMPLATES_DIR = ./pages
STATIC_DIR = ./static

.PHONY: build
build: $(BIN)

.PHONY: deps
deps:
	GO111MODULE=off go install github.com/jteeuwen/go-bindata/go-bindata
	npm install

$(BIN): bindata.go
	echo $(LDFLAGS)
	go build -ldflags $(LDFLAGS) -o $(BIN) ./cmd/shielded

.PHONY: lint
lint:
	./node_modules/.bin/tslint -c tslint.json ts/**/*.ts --fix 

.PHONY: debug
debug: bindata.go
	go-bindata -debug -fs -pkg shieldeddotdev -prefix "$(STATIC_DIR)/" $(STATIC_DIR)/...
	$(MAKE) BIN="shielded-debug" LDADDIT="-X main.rootHost=local.shielded.dev -X main.apiHost=api.local.shielded.dev -X main.imgHost=img.local.shielded.dev" build
	./shielded-debug -letsencrypt=false

bindata.go: $(shell find $(STATIC_DIR) -type f)
	go-bindata -fs -pkg shieldeddotdev -prefix "$(STATIC_DIR)/" $(STATIC_DIR)/...

$(shell find $(STATIC_DIR) -name "*.css"): $(shell find scss -name "*.scss")
	compass compile

$(STATIC_DIR)/main.js: $(shell find ts -name "*.ts") webpack.config.js tsconfig.json
	./node_modules/.bin/webpack --mode=production

$(STATIC_DIR)/min.js: require.min.js $(STATIC_DIR)/main.js
	cat require.min.js $(STATIC_DIR)/main.js > $(STATIC_DIR)/min.js

$(shell find $(STATIC_DIR) -name "*.html"): $(shell find $(TEMPLATES_DIR) -name "*.php")
	$(foreach file, $(wildcard $(TEMPLATES_DIR)/*.html.php), php $(file) > $(STATIC_DIR)/$$(basename $(file) | sed 's/\.[^.]*$$//'); )
	./node_modules/.bin/html-minifier --input-dir static --output-dir static --file-ext html --collapse-whitespace --conservative-collapse
