DEBUG=debug*,info*,warn*,error*,node-fix*
LOG_LEVEL=0
SRC = **/*.js

run-example:
	./node_modules/.bin/supervisor -w . -e "js,jsx,less" ./example/index.js

.PHONY: test
