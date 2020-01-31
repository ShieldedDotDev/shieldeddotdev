TEMPLATES_DIR = ./pages
STATIC_DIR = ./static

.PHONY: build
build: bindata.go
	go build ./cmd/shielded

.PHONY: lint
lint:
	./node_modules/.bin/tslint -c tslint.json ts/**/*.ts --fix 

.PHONY: debug
debug: bindata.go
	go-bindata -debug -fs -pkg shieldeddotdev -prefix "$(STATIC_DIR)/" $(STATIC_DIR)/...
	go build ./cmd/shielded
	./shielded -local=true

bindata.go: $(shell find $(STATIC_DIR) -type f)
	go-bindata -fs -pkg shieldeddotdev -prefix "$(STATIC_DIR)/" $(STATIC_DIR)/...

$(shell find $(STATIC_DIR) -name "*.css"): $(shell find scss -name "*.scss")
	compass compile

$(STATIC_DIR)/main.js: $(shell find ts -name "*.ts")
	./node_modules/.bin/tsc

$(shell find $(STATIC_DIR) -name "*.html"): $(shell find pages -name "*.php")
	$(foreach file, $(wildcard $(TEMPLATES_DIR)/*.html.php), php $(file) > $(STATIC_DIR)/$$(basename $(file) | sed 's/\.[^.]*$$//'); )
	./node_modules/.bin/html-minifier --input-dir static --output-dir static --file-ext html --collapse-whitespace --conservative-collapse