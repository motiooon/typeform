REPORTER = spec

test:
	@./node_modules/.bin/mocha test/**/*.js \
		--reporter $(REPORTER)

test-w:
	@./node_modules/.bin/mocha test/**/*.js \
		--reporter $(REPORTER) \
		--watch

.PHONY: test