#include <unordered_map>
#include <string>
#include <vector>

const int USER_HASH_LEN = 64;

typedef char UserHash[USER_HASH_LEN];

struct Message {
    int64_t time;
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
        std::unordered_map<(char*), T> userMap;

        T* getUserOrCreate(UserHash user) {
            if (auto key = userMap.find(user); key != userMap.end()) {
                return key;
            }
            T child{};
            userMap.insert(std::make_pair(user, child));
            return child;
        }

        T* getUser(UserHash user) {
            if (auto key = userMap.find(user); key != userMap.end()) {
                return key;
            }
            return nullptr;
        }

};

class DB {

    private:
        UserMap<UserMap<std::vector<Message>>> db;
        UserMap<RootPubKey> rootPubKeys;

    public:

        void send_message(UserHash from, UserHash to, int len, char* message);
        UserMap<std::vector<Message>>* getMessages(UserHash user);

        RootPubKey* getRootPubKey(UserHash user);

        void saveData(char* fileName);
        void loadData(char* fileName);

        DB();
        ~DB();

};
