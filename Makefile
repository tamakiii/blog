.PHONY: help build clean dev

help:
	@cat $(firstword $(MAKEFILE_LIST))

build: node_modules ## Build the site
	npm run build
	mkdir -p docs/articles
	cp -r article/* docs/articles/
	npm run generate:index
	npm run generate:pages

clean: ## Clean build artifacts
	rm -rf docs node_modules

dev: node_modules ## Start development server
	npm run dev

node_modules: package.json package-lock.json
	npm ci
	touch node_modules
