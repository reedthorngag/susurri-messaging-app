#include <unordered_map>
#include <vector>
#include <string>
#include <chrono>
#include <fstream>
#include <stdio.h>

#include "db.hpp"
#include <string.h>

inline int64_t epoch_millis() {
    return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
}

void DB::send_message(UserHash from, UserHash to, int len, char* message) {
    this->db.getUserOrCreate(from)->getUserOrCreate(to)->push_back({epoch_millis(),len,message});
}

UserMap<std::vector<Message>>* DB::getMessages(UserHash user) {
    return this->db.getUserOrCreate(user);
}

RootPubKey* DB::getRootPubKey(UserHash user) {
    return this->rootPubKeys.getUser(user);
}

void DB::loadData(char* fileName) {

    std::ifstream file(fileName, std::ios::binary);
    if (!file.is_open()) {
        printf("Error: Failed to load DB data: Failed to open %s\n", fileName);
        return;
    }

    union {
        char data[8];
        int int32;
        uint64_t int64;
        char magicBytes[4];
    } buf;

    file.read(buf.data, 4);

    if (buf.int32 != (int)"SECU") {
        printf("Error: Failed to load DB data: Magic bytes not detected, found '%s', expected 'SECU'\n", buf.magicBytes);
        return;
    }

    file.read(buf.data, 8);

    for (int i = buf.int32; --i)

}

#define writeSize(x) size = (uint64_t)x; file.write((char*)&size, 8)

void DB::saveData(char* fileName) {

    std::ofstream file(fileName, std::ios::binary | std::ios::trunc);
    if (!file.is_open()) {
        printf("Error: Failed to save DB data: Failed to open %s\n", fileName);
        return;
    }

    uint64_t size;

    file.write("SECU",4);
    writeSize(this->rootPubKeys.userMap.size());
    for (auto& [user, rootPubKey] : this->rootPubKeys.userMap) {
        file.write(user, USER_HASH_LEN);
        file << rootPubKey->len;
        file.write(rootPubKey->data, rootPubKey->len);
    }
    
    writeSize(this->db.userMap.size());
    for (auto& [user, child] : this->db.userMap) {
        file.write(user,USER_HASH_LEN);

        size = (uint64_t)child->userMap.size();
        file.write(((char*)&size)+4, 4);
        for (auto& [user, messages] : child->userMap) {
            file.write(user,USER_HASH_LEN);

            writeSize(messages->size());
            for (Message message : *messages) {
                writeSize(message.time);
                size = (uint64_t)message.len;
                file.write(((char*)&size)+4, 4);
                file.write(message.data, message.len);
            }
        }
    }
}

DB::DB() {

}

DB::~DB() {
    for (auto& [user, child] : this->db.userMap) {
        for (auto& [user, messages] : child->userMap) {
            delete messages;
        }
        delete child;
    }
}

