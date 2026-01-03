.PHONY: help build clean preview

help:
	@cat $(firstword $(MAKEFILE_LIST))

build: \
	node_modules \
	docs \
	docs/articles \
	docs/articles/index.json \
	docs/CNAME

clean: ## Clean build artifacts
	rm -rf docs node_modules

preview: build ## Preview production build
	npx vite preview

node_modules: package.json package-lock.json
	npm ci
	touch $@

docs: node_modules
	npx tsc
	npx vite build

docs/articles: | docs
	mkdir -p $@
	cp -r article/* $@

docs/articles/index.json: docs/articles
	npx tsx script/generate-index.ts
	npx tsx script/generate-pages.ts

docs/CNAME: CNAME | docs
	cp $< $@
