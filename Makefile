.PHONY: docs clean

docs:
	mkdir -p docs
	cp -r article/* docs/
	cp CNAME docs/

clean:
	rm -rf docs
