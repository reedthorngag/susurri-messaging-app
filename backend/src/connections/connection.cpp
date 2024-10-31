#include <string>
#include <stdio.h>
#include <stdlib.h>
#include <unordered_map>
#include <unistd.h>

#include "connection.hpp"
#include "../global_state.hpp"

extern State state;
extern bool running;

void Connection::init(void* data) {
    
    Connection* conn = (Connection*)data;

    int len = 0;

    while (running) {
        read(conn->conn, &len, 4);

        char* buf = new char[len];

        read(conn->conn, buf, len);

        int requestId = *(int*)buf;

        char* ptr = buf + 4;

        switch (*ptr) {
            case 0:
                write(conn.conn, buf, 5);
                break;
            case 1:
                
        }
    }
}

Connection::~Connection() {
    printf("Connection destructor called!\n");
}
