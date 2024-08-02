#include <unordered_map>
#include <string>

#include "connection_pool.hpp"

void ConnectionPool::addConnection(Connection* con) {
    this->connections.insert(std::make_pair(con->userHash,con));
}

Connection* ConnectionPool::getConnection(std::string userHash) {

}

ConnectionPool::~ConnectionPool() {
    for (auto& [userHash, connection] : this->connections) {
        delete connection;
    }
}

