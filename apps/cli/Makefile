# Makefile for Pendek CLI
# ======================

BINARY_NAME=pendek
BUILD_DIR=bin
VERSION ?= dev
COMMIT_SHA := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_DATE := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
LDFLAGS := -ldflags "-s -w \
	-X github.com/andriawan24/pendek-in-cli/internal/command.Version=$(VERSION) \
	-X github.com/andriawan24/pendek-in-cli/internal/command.CommitSHA=$(COMMIT_SHA) \
	-X github.com/andriawan24/pendek-in-cli/internal/command.BuildDate=$(BUILD_DATE)"

.PHONY: build test lint fmt tidy clean install

build:
	go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/pendek/

test:
	go test ./...

lint:
	golangci-lint run ./...

fmt:
	gofmt -s -w .

tidy:
	go mod tidy

clean:
	rm -rf $(BUILD_DIR)

install: build
	cp $(BUILD_DIR)/$(BINARY_NAME) $(GOPATH)/bin/$(BINARY_NAME) 2>/dev/null || \
	cp $(BUILD_DIR)/$(BINARY_NAME) $(HOME)/go/bin/$(BINARY_NAME)
