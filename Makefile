####### 普段の開発向け
.PHONY: run
run:
	cd t0016Go/cmd && go run main.go

.PHONY: db-be
db-be:
	docker compose up -d db
	make run

.PHONY: fe
fe:
	cd t0016Next/myapp && npm run dev

.PHONY: mysql
mysql:
	mysql -uroot -ppassword --host 127.0.0.1

# セットアップ向け
.PHONY: setup
setup:\
	make-env-db\
	make-env-app\
	make-env-api
	cd t0016Next/myapp && npm install
# 　　↓不要？
	cd t0016Go && go mod tidy

.PHONY: make-env-db
make-env-db:
	cd db && cp sample.env .env

.PHONY: make-env-app
make-env-app:
	cd t0016Next && cp sample.env .env

.PHONY: make-env-api
make-env-api:
	cd t0016Go && cp sample.env .env



# TODO: localでエラーチェックしたい
# .PHONY: build
# run:
# 	go build -v ./t0016Go/cmd/... 

# .PHONY: test
# run:
# 	go test -v ./... 
