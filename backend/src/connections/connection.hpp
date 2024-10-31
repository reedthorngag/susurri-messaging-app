#include <string>
#include <threads.h>
#include <netinet/in.h>

#include "../global_state.hpp"

extern State state;

class Connection {
    
    public:
        pthread_t* thread;
        int conn;
        struct sockaddr_in addr;
        socklen_t addr_len;
        

        void init(void* data);

        ~Connection();
};

