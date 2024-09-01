# FROM golang:1.18-alpine

# WORKDIR /api/src

# COPY . .

# RUN go mod tidy

# EXPOSE 8080

# CMD [ "go","run","cmd/main.go" ]


#### ビルドステージ ####
FROM golang:1.18-alpine AS builder

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# C言語との統合を防いで少しでも軽くする…らしい。
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/main.go

#### 実行ステージ ####
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 重要：ビルドされたmainのみをコピー
COPY --from=builder /build/main .

EXPOSE 8080

CMD ["./main"]