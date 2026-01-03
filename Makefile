.PHONY: docs clean

docs:
	mkdir -p docs
	cp -r article/* docs/

clean:
	rm -rf docs
