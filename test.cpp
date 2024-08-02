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

const int defaultPort = 9720;
const char* portStr = "9720";

int sock = 0;

bool strcmp(const char* a, const char* b) {
    while (*a++ && *b++) if (*a != *b) return false;
    return true;
}

void handle_sigint([[maybe_unused]] int s) {
    printf("\nClosing connection...\n");
    if (sock) close(sock);
    sock = 0;
}

int server(int argc, char** argv) {
    int port = defaultPort;

    if (argc > 2) {
        try {
            port = std::atoi(argv[2]);
            if (port > 65535 || port < 0) {
                throw std::invalid_argument("Port number out of range!");
            }
        } catch (std::invalid_argument &e) {
            printf("Error, invalid port '%s'! Error: %s\n", argv[2], e.what());
            return 0;
        }
    }

    struct sockaddr_in addr{};

    sock = socket(AF_INET, SOCK_STREAM | SOCK_NONBLOCK, 0);

    if (sock < 0) {
        printf("Failed to create socket!\n");
        return 0;
    }

    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sock, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        printf("Bind call failed!\n");
        return 0;
    }

    if (listen(sock, 1) < 0) {   
        printf("Call to listen failed!\n");
        return 0;
    }

    printf("Waiting for client connection.");
    fflush(stdout);

    addr = {};
    socklen_t len = sizeof(addr);

    int count = 0;

    int conn;

    while ((conn = accept(sock, (struct sockaddr*)&addr, &len)) < 0) {
        if (!sock) return 0; // so it ends without outputting an error if a SIGINT occurs (SIGINT handler sets sock to 0)

        if (errno != EWOULDBLOCK) {
            printf("\nError: accept call failed! errno: %i\n",errno);
            return 0;
        }

        usleep(500000); // 500ms

        if (count++ == 3) {
            printf("\b\b\b   \b\b\b");
            count = 0;

        } else printf(".");

        fflush(stdout);
    }

    fcntl(conn, F_SETFD, O_NONBLOCK);

    // convert the ip address into a human readable string
    char s[INET6_ADDRSTRLEN]{};
    inet_ntop(addr.sin_family, &addr.sin_addr, s, sizeof(s));

    printf("\nConnected to %s\n", s);

    close(sock);

    sock = conn;

    return sock;

}

int client(int argc, char** argv) {

    char* addr = (char*)"localhost";
    int port = defaultPort;
    int sock;

    if (argc > 2) {
        addr = argv[2];
    }

    if (argc == 3) {
        try {
            port = std::atoi(argv[3]);
            if (port > 65535 || port < 0) {
                throw std::invalid_argument("Port number out of range!");
            }
        } catch (std::invalid_argument &e) {
            printf("Error, invalid port '%s'! Error: %s\n", argv[3], e.what());
            return 0;
        }
    }

    printf("Attempting to connect to %s on port %i...\n", addr, port);

    struct addrinfo hints{}, *result;
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;

    int r;

    if ((r = getaddrinfo(addr,argc == 3 ? argv[3] : portStr, &hints, &result)) != 0) {
        printf("Error, getaddrinfo failed: %s\n", gai_strerror(r));
        return 0;
    }

    sock = socket(AF_INET,SOCK_STREAM, 0);

    if (sock < 0) {
        printf("Failed to create socket!\n");
        return 0;
    }

    if (connect(sock, result->ai_addr, result->ai_addrlen) < 0) {
        printf("Failed to connect! errno: %i\n", errno);
        close(sock);
        return 0;
    }

    // have to set this after call to connect
    fcntl(sock, F_SETFD, O_NONBLOCK);

    char s[INET6_ADDRSTRLEN]{};
    inet_ntop(result->ai_family, &result->ai_addr, s, sizeof(s));

    printf("Connected to %s!\n", s);

    return sock;
}

int main(int argc, char** argv) {

    struct sigaction sigIntHandler;

    sigIntHandler.sa_handler = handle_sigint;
    sigemptyset(&sigIntHandler.sa_mask);
    sigIntHandler.sa_flags = 0;

    sigaction(SIGINT, &sigIntHandler, NULL);


    // if no arguments are supplied, start listening as a server on the default port
    if (argc == 1) {
        printf("Defaulting to server on port %i...\n", defaultPort);
        sock = server(0, nullptr);

    } else if (strcmp(argv[1],"server")) {
        sock = server(argc, argv);

    } else if (strcmp(argv[1],"client")) {
        sock = client(argc, argv);

    } else {
        printf("%s [client|server] [ip] [port]\nExamples:\n   %s server 1234\n   %s client 192.168.1.69 1234\n\n",argv[0],argv[0],argv[0]);
        return 0;
    }

    if (!sock) {
        return 1;
    }

    // set stdin to non blocking
    fcntl(STDIN_FILENO, F_SETFL, O_NONBLOCK);
    fcntl(sock, F_SETFL, O_NONBLOCK);

    const int BUF_SIZE = 4096;

    char inputBuf[BUF_SIZE];
    int inputLen;

    char outputBuf[BUF_SIZE];
    char* outputBufPtr = outputBuf;
    int outputLen = 0;

    while (sock) {
        usleep(10000);
        while ((inputLen = read(sock, inputBuf, BUF_SIZE)) > 0) {
            printf("\r                                         \rhgjhnjkml");
            write(STDOUT_FILENO, inputBuf, inputLen);
            printf("\n%i> ",inputLen);
            if (outputLen) write(STDOUT_FILENO, outputBuf, outputLen);
            fflush(stdout);
        }

        while (read(STDIN_FILENO, outputBufPtr, 1) > 0) {
            if (*outputBufPtr == '\n') {
                write(sock,outputBuf,outputLen);
                printf("\r");
                write(STDOUT_FILENO, outputBuf, outputLen);
                printf("\n>  ");
                fflush(stdout);
                outputLen = 0;
                outputBufPtr = outputBuf;
            }
            else {
                outputBufPtr++;
                outputLen++;
            }
        }
    }

}



