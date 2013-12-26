REPORTER = spec

test:
	@./node_modules/.bin/mocha test/**/*.js \
		--reporter $(REPORTER)

test-w:
	@./node_modules/.bin/mocha test/**/*.js \
		--reporter $(REPORTER) \
		--watch

test-cov: lib-cov
		@MYPROJ_COVERAGE=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
		@jscoverage lib lib-cov

.PHONY: test