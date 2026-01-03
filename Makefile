.PHONY: help build clean docs

help:
	@cat $(firstword $(MAKEFILE_LIST))

build: \
	docs \
	docs/CNAME \
	docs/index.html

clean:
	rm -rf docs

docs:
	mkdir -p docs

docs/index.html:
	cp -r article/* docs/

docs/CNAME: | CNAME
	cp $| $@
