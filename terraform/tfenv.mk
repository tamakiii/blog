.PHONY: help install uninstall

help:
	@cat $(firstword $(MAKEFILE_LIST))

install:
	tfenv install

uninstall:
	tfenv uninstall
