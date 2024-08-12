#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <stdexcept>
#include <netdb.h>
#include <signal.h>
#include <csignal>
#include <fcntl.h>

#include "global_state.hpp"

const int port = 9852;
const char* portStr = "9852";
int sock = 0;

State state{};

bool running = true;

void selfConnect() {

    int sock;

    sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(8080);
    addr.sin_addr.s_addr = INADDR_ANY;

    sock = socket(AF_INET,SOCK_STREAM, 0);

    if (sock < 0) {
        printf("Failed to create socket!\n");
        return;
    }

    if (connect(sock, (sockaddr*)&addr, sizeof(addr)) < 0) {
        printf("Failed to connect! errno: %i\n", errno);
        close(sock);
        return;
    }

    close(sock);

}

void handle_sigint([[maybe_unused]] int s) {
    printf("\nKilling server...\n");
    running = false;
    for (int i = 5; i--;) {
        usleep(100000);
        selfConnect();
    }
}

void acceptConnection() {

}

int main() {

    state.connPool = new ConnectionPool();
    state.db = new DB();

    struct sigaction sigIntHandler;

    sigIntHandler.sa_handler = handle_sigint;
    sigemptyset(&sigIntHandler.sa_mask);
    sigIntHandler.sa_flags = 0;

    sigaction(SIGINT, &sigIntHandler, NULL);

    printf("Starting server...\n");

    struct sockaddr_in addr{};

    sock = socket(AF_INET, SOCK_STREAM | SOCK_NONBLOCK, 0);

    if (sock < 0) {
        printf("Failed to create socket!\n");
        return 1;
    }

    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sock, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        printf("Bind call failed!\n");
        return 1;
    }

    if (listen(sock, 1) < 0) {   
        printf("Call to listen failed!\n");
        return 1;
    }

    char* a = (char*)"hello";
    char* b = (char*)"goodb";

    char* h1 = (char*)"hello1";
    char* h2 = (char*)"hello2";

    char* pk1 = (char*)"123";
    char* pk2 = (char*)"456";

    state.db->send_message(UserHash(a),UserHash(b), 6, h1);
    state.db->send_message(UserHash(b),UserHash(a), 6, h2);

    state.db->setRootPubKey(UserHash(a),RootPubKey{3, pk1});
    state.db->setRootPubKey(UserHash(b),RootPubKey{3, pk2});

    char* t = (char*)"testdb";

    state.db->saveData(t);

    delete state.db;

    state.db = new DB();

    state.db->loadData(t);

    printf("%s",state.db->getMessages(UserHash((char*)"hello"))->getUser(UserHash((char*)"goodb"))->at(0).data);

    while(running) {
        acceptConnection();
    }

    delete state.connPool;
    delete state.db;

    close(sock);

    return 0;
}

