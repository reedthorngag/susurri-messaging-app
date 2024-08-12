

SHELL := bash

all: build

CFLAGS = -Wall -W -Werror -Wno-unused-parameter -Wno-unused-variable
DIRS = src/ src/connections/
SRC = $(foreach dir,$(DIRS), $(wildcard $(dir)*.cpp))

build: $(SRC)
	g++ $(CFLAGS) $(SRC) -o bin/server

clean:
	rm bin/server

run:
	make build
	./bin/server


