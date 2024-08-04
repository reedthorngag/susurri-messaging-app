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

#include "connections/connection_pool.hpp"

const int port = 9852;
const char* portStr = "9852";
int sock = 0;
ConnectionPool* connectionPool;

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

    connectionPool = new ConnectionPool();

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

    while(running) {
        acceptConnection();
    }

    delete connectionPool;

    close(sock);

    return 0;
}

