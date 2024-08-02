#include <string>
#include <stdio.h>

#include "connection.hpp"


Connection::~Connection() {
    printf("Connection destructor called!\n");
}
