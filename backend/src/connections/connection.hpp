#include <string>
#include <threads.h>

class Connection {
    
    public:
        std::string userHash;
        pthread_t* thread;
        

        void init(void* data);

        ~Connection();
};

