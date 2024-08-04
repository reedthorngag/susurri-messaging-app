#include <unordered_map>
#include <string>
#include <vector>

struct message {
    uint64_t time;
    char* message;
};

template <typename T>
class UserMap {

    public:
        std::unordered_map<std::string, T> userMap;

        T getUser(std::string user) {
            if (auto key = userMap.find(user); key != userMap.end()) {
                return key;
            }
            return nullptr;
        }

};

class DB {

    private:
        UserMap<UserMap<std::vector<message>*>*> db;
        std::unordered_map<std::string, char*> rootPubKeys;

    public:

        void send_message(std::string from, std::string to, char* message);
        std::unordered_map<std::string, std::vector<message>*>* getMessages(std::string user);

        char* getRootPubKey(std::string user);

        DB();
        ~DB();

};
