.PHONY: help init plan

help:
	@cat $(firstword $(MAKEFILE_LIST))

init:
	terraform init

plan: \
	terraform.tfplan

unplan:
	rm terraform.tfplan

apply: | terraform.tfplan
	terraform apply $|

terraform.tfplan:
	terraform plan -out=$@
