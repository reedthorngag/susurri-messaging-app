#include <unordered_map>
#include <string>

#include "connection.hpp"

class ConnectionPool {

    private:


    public:
        void addConnection(Connection* con);
        void connectionExists(string userHash);

}

