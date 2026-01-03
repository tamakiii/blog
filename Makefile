.PHONY: help build clean

-include dev.mk

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
	npx tsx scripts/generate-index.ts
	npx tsx scripts/generate-pages.ts

docs/CNAME: CNAME | docs
	cp $< $@
