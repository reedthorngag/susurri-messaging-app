#include <unordered_map>
#include <string>
#include <cstring>
#include <vector>

const int USER_HASH_LEN = 5;

class UserHash {

    private:
        bool strCached;

    public:
        char chars[USER_HASH_LEN+1]{};
        std::string string;

        std::string str() {
            if (strCached) return string;
            string = std::string(chars);
            strCached = true;
            return string;
        }

        UserHash(char* hash) {
            memcpy(this->chars, hash, USER_HASH_LEN);
        }

        UserHash() {

        }
};

struct Message {
    char* user;
    uint64_t time;
    unsigned int id;
    int len;
    char* data;
};

struct RootPubKey {
    int len;
    char* data;
};

template <typename T>
class UserMap {

    public:
        std::unordered_map<std::string, T*> userMap;

        T* getUserOrCreate(UserHash* user) {
            if (auto key = userMap.find(user->str()); key != userMap.end()) {
                return key->second;
            }
            T* child = new T;
            userMap.insert(std::make_pair(user->str(), child));
            return child;
        }

        T* getUser(UserHash* user) {
            if (auto key = userMap.find(user->str()); key != userMap.end()) {
                return key->second;
            }
            return nullptr;
        }

};

class DB {

    private:
        UserMap<std::vector<Message>> db;
        UserMap<RootPubKey> rootPubKeys;

    public:

        void send_message(UserHash* userHash, char* user, int len, char* message);
        std::vector<Message>* getMessages(UserHash* user);

        RootPubKey getRootPubKey(UserHash* user);
        void setRootPubKey(UserHash* user, RootPubKey* pubKey);

        void saveData(char* fileName);
        void loadData(char* fileName);

        DB();
        ~DB();

};
