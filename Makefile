.PHONY: help build clean test preview

help:
	@cat $(firstword $(MAKEFILE_LIST))

build: \
	node_modules \
	docs \
	docs/en_US \
	docs/ja_JP \
	docs/index.json \
	docs/tags \
	docs/CNAME

clean: ## Clean build artifacts
	rm -rf docs node_modules

test:
	npx --no vitest run

preview: build ## Preview production build
	npx vite preview

node_modules: package.json package-lock.json
	npm ci
	touch $@

docs: node_modules
	npx tsc
	npx vite build

docs/en_US: article/en_US | docs
	cp -r $< $|

docs/ja_JP: article/ja_JP | docs
	cp -r $< $|

docs/index.json: docs/en_US docs/ja_JP
	npx tsx script/generate-index.ts

docs/tags: docs/index.json
	npx tsx script/generate-pages.ts

docs/CNAME: CNAME | docs
	cp $< $@
