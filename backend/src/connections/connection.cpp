#include <string>
#include <stdio.h>
#include <stdlib.h>
#include <unordered_map>
#include <unistd.h>

#include "connection.hpp"
#include "../global_state.hpp"

extern State state;
extern bool running;

void sendMessages(Connection* conn, int len, char* buf, char* ptr) {
    printf("Sending messages...\n");

    struct Data {
        char* data;
        int len;
        bool del;
    };
    std::vector<Data> pieces;
    pieces.push_back(Data{ptr, 5, false});

    std::string id;
    int offset;
    int count;

    for (int i = 0; i < 3; i++) {
        switch (*ptr) {
            case 0: {
                printf("Reading ID..\n");
                ptr++;
                int len2 = *(int*)ptr;
                ptr += 4;
                char* id2 = new char(len2+1);
                id2[len2] = 0;
                memcpy(id2,ptr,len2);
                id = new std::string(id2);
                ptr += len2;
                break;
            }
            case 1: {
                printf("Reading offset...\n");
                ptr++;
                offset = *(int*)ptr;
                ptr += 4;
                break;
            }
            case 2:
                printf("Reading count...\n");
                fflush(stdout);
                ptr++;
                count = *(int*)ptr;
                ptr += 4;
                break;
        }
    }
    printf("Offset: %d, count: %d, id: %s\n",offset, count, id.c_str());

    std::vector<Message> messages = state.db->getMessages(UserHash{id.c_str()});

    int n = 0;
    if (offset < messages.size()) {
        n = ((messages.size() - offset) < count) ? (messages.size() - offset) : count;
    }
    pieces.push_back(Data{&n, 4, false});

    for (int i = 0; i < n; i++) {
        printf("Parsing message...\n");
        Message m = messages.at(offset + i);

        unsigned char usrLen = strlen(m.user);
        int l = 1 + usrlen + 8 + 4 + 4 + m.len;

        char* b = new char[l];

        char* p = b;
        *p = usrLen;
        p++;
        memcpy(p,m.user,usrLen);
        p += usrLen;
        
        *(uint64_t*)p = m.time;
        p += 8;

        *(int*)p = m.id;
        p += 4;

        *(int*)p = m.len;
        p += 4;

        memcpy(p,m.data,m.len);

        printf("Parsed message with total len %d\n",l);
        pieces.push_back(Data{b,l,true});
    }

    printf("n is %d\n", n);

    for (Data d : pieces) {
        send(conn.conn, d.data, d.len);
        if (d.del) delete d.data;
    }
    printf("Sent messages!\n");
}

void Connection::init(void* data) {
    printf("Connection created!\n");
    
    Connection* conn = (Connection*)data;

    int len = 0;

    while (running) {
        read(conn->conn, &len, 4);
        printf("Received data! len: %d\n",len);

        char* buf = new char[len];

        read(conn->conn, buf, len);

        int requestId = *(int*)buf;
        printf("Request ID: %d\n",requestId);

        char* ptr = buf + 4;

        switch (*ptr) {
            case 0:
                write(conn.conn, buf, 5);
                break;
            case 1:
                sendMessages(conn, len, buf, ptr);
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
        }

        delete buf;
    }
}

Connection::~Connection() {
    printf("Connection destructor called!\n");
}
