#include <unordered_map>
#include <string>

#include "connection.hpp"

class ConnectionPool {

    private:
        std::unordered_map<std::string, Connection*> connections;

    public:
        void addConnection(Connection* con);
        Connection* getConnection(std::string userHash);
        
    ~ConnectionPool();
};

