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

void DB::send_message(UserHash* userHash, char* user, int len, char* message) {
    this->db.getUserOrCreate(userHash)->push_back({user,epoch_millis(),len,message});
}

std::vector<Message>* DB::getMessages(UserHash* user) {
    return this->db.getUserOrCreate(user);
}

RootPubKey DB::getRootPubKey(UserHash* user) {
    return *this->rootPubKeys.getUser(user);
}

void DB::setRootPubKey(UserHash* user, RootPubKey* pubKey) {
    this->rootPubKeys.userMap.insert(std::make_pair(user->str(), pubKey));
}

void DB::loadData(char* fileName) {

    printf("Loading DB from %s...\n",fileName);

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

    if (buf.int32 != *(int*)"SECU") {
        buf.data[4] = 0;
        printf("Error: Failed to load DB data: Magic bytes not detected, found '%s', expected 'SECU'\n", buf.magicBytes);
        return;
    }

    file.seekg(-4, std::ios::end);

    file.read(buf.data, 4);

    if (buf.int32 != *(int*)"UCES") {
        buf.data[4] = 0;
        printf("Error: Failed to load DB data: File corrupted, end bytes not found, expecting 'UCES', found '%s'\n", buf.magicBytes);
        return;
    }

    file.seekg(4, std::ios::beg);

    file.read(buf.data, 8);

    this->rootPubKeys.userMap.reserve(buf.int64);

    for (int i = buf.int64; i--; ) {
        UserHash* hash = new UserHash{};
        file.read(hash->chars, USER_HASH_LEN);

        file.read(buf.data, 4);
        RootPubKey* key = new RootPubKey{buf.int32, new char[buf.int32]};
        file.read(key->data, key->len);

        this->rootPubKeys.userMap.insert(std::make_pair(hash->str(),key));
    }

    file.read(buf.data, 8);

    this->db.userMap.reserve(buf.int64);

    UserHash* hash;

    for (int i = buf.int64; i--; ) {
        hash = new UserHash{};
        file.read(hash->chars, USER_HASH_LEN);

        file.read(buf.data, 8);
        std::vector<Message>* messages = new std::vector<Message>();
        messages->reserve(buf.int64);

        for (int m = buf.int64; m--; ) {

            Message message{};

            int message_usr_len;
            file.read((char*)&message_usr_len, sizeof(message_usr_len));
            message.user = new char[message_usr_len+1];
            message.user[message_usr_len] = 0;
            file.read(message.user, message_usr_len);

            file.read((char*)&message.time, sizeof(message.time));
            file.read((char*)&message.id, sizeof(message.id));
            file.read((char*)&message.len, sizeof(message.len));

            message.data = new char[message.len+1];
            message.data[message.len] = 0;
            file.read(message.data, message.len);

            messages->push_back(message);
        }

        this->db.userMap.insert(std::make_pair(hash->str(), messages));
    }

    printf("Loaded DB!\n");
}

#define writeSize(x) size = (uint64_t)x; file.write((char*)&size, 8)

void DB::saveData(char* fileName) {

    printf("Saving DB to %s...\n",fileName);

    std::ofstream file(fileName, std::ios::binary | std::ios::trunc);
    if (!file.is_open()) {
        printf("Error: Failed to save DB data: Failed to open %s\n", fileName);
        return;
    }

    uint64_t size;

    file.write("SECU",4);
    writeSize(this->rootPubKeys.userMap.size());
    printf("Root pub keys size: %d\n", (int)this->rootPubKeys.userMap.size());
    for (auto& [user, rootPubKey] : this->rootPubKeys.userMap) {
        file.write(user.c_str(), USER_HASH_LEN);
        printf("user: %s\n",user.c_str());

        file.write(((char*)&rootPubKey->len), sizeof(rootPubKey->len));
        file.write(rootPubKey->data, rootPubKey->len);
    }
    
    writeSize(this->db.userMap.size());
    printf("User db size: %d\n", (int)this->db.userMap.size());
    for (auto& pair : this->db.userMap) {
        file.write(pair.first.c_str(), USER_HASH_LEN);

        writeSize(pair.second->size());
        for (Message message : *pair.second) {
            int message_usr_len = strlen(message.user);
            file.write((char*)&message_usr_len, sizeof(message_usr_len));
            file.write(message.user, strlen(message.user));
            file.write((char*)&message.time, sizeof(message.time));
            file.write((char*)&message.id, sizeof(message.id));
            file.write((char*)&message.len, sizeof(message.len));
            file.write(message.data, message.len);
        }
    }
    file.write("UCES",4);

    printf("Saved DB!\n");
}

DB::DB() {

}

DB::~DB() {
    for (auto& [user, messages] : this->db.userMap) {
        delete messages;
    }
}

