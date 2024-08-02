
SHELL := bash

all: build

CFLAGS = -Wall -W -Werror -Wno-unused-parameter -Wno-unused-variable
DIRS = ./
SRC = $(foreach dir,$(DIRS), $(wildcard $(dir)*.cpp))

build: $(SRC)
	g++ $(CFLAGS) $(SRC) -o test

clean:
	rm test



