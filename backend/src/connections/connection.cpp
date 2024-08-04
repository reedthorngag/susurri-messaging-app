#include <string>
#include <stdio.h>

#include "connection.hpp"

void Connection::init(void* data) {
    
}

Connection::~Connection() {
    printf("Connection destructor called!\n");
}
