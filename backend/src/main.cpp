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

void handle_sigint([[maybe_unused]] int s) {
    printf("\nKilling server...\n");
}

void main() {

    struct sigaction sigIntHandler;

    sigIntHandler.sa_handler = handle_sigint;
    sigemptyset(&sigIntHandler.sa_mask);
    sigIntHandler.sa_flags = 0;

    sigaction(SIGINT, &sigIntHandler, NULL);

    printf("hello world!\n");

}

