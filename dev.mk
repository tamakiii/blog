.PHONY: help dev

help:
	@cat $(firstword $(MAKEFILE_LIST))

dev: node_modules ## Start development server
	npx vite

node_modules:
	$(MAKE) node_modules
