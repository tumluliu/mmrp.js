BROWSERIFY = node_modules/.bin/browserify

all: dist/mmrp.js

node_modules/.install: package.json
	npm install && touch node_modules/.install

dist:
	mkdir -p dist

dist/mmrp.js: node_modules/.install dist $(shell $(BROWSERIFY) --list index.js)
	npm run build

clean:
	rm -rf dist/mmrp.js

install:
	make && cp dist/mmrp.js ../mmrp-web/scripts/ && cp dist/mmrp.css ../mmrp-web/styles/ && cp dist/*.png ../mmrp-web/styles/

D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/end.js

lib/d3.js: $(D3_FILES)
	node_modules/.bin/smash $(D3_FILES) > $@
