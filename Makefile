.PHONY: help build clean dev

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

dev: node_modules ## Start development server
	npm run dev

node_modules: package.json package-lock.json
	npm ci
	touch $@

docs: node_modules
	npm run build

docs/articles: | docs
	mkdir -p $@
	cp -r article/* $@

docs/articles/index.json: docs/articles
	npm run generate:index
	npm run generate:pages

docs/CNAME: CNAME | docs
	cp $< $@
