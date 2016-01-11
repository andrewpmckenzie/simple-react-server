DEBUG=debug*,info*,warn*,error*,node-fix*
LOG_LEVEL=0
SRC = **/*.js

run:
	supervisor -w lib -e "js,jsx,less" ./index.js

.PHONY: test
