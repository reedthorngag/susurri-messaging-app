#include <unordered_map>
#include <vector>
#include <string>

#include "db.hpp"

void DB::send_message(std::string from, std::string to, char* message) {

}

std::unordered_map<std::string, std::vector<message>*>* DB::getMessages(std::string user) {
    return nullptr;
}

char* DB::getRootPubKey(std::string user) {
    return nullptr;
}

DB::DB() {

}

DB::~DB() {

}

