/**
 * @file es_mock.cpp
 * @brief Hacky Elasticsearch mock — canned JSON on :9200.
 *
 * Lets the backend's ES client run unmodified ("thinks it's
 * talking to ES, but it's mocked") so the heavy ES JVM can be
 * dropped on the constrained host. Not a real search engine:
 * indexing is acknowledged, every search returns zero hits.
 */
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <string>
#include <string_view>

namespace
{

constexpr int kPort = 9200;

/** @brief Canned ES-shaped JSON for a method + path. */
std::string bodyFor(std::string_view m, std::string_view p)
{
    using sv = std::string_view;
    if (p == "/")
        return R"({"version":{"number":"8.17.0"},)"
               R"("tagline":"You Know, for Search"})";
    if (p.find("/_cluster/health") != sv::npos)
        return R"({"status":"green","number_of_nodes":1})";
    if (p.find("/_search") != sv::npos)
        return R"({"took":1,"timed_out":false,"hits":)"
               R"({"total":{"value":0,"relation":"eq"},)"
               R"("max_score":null,"hits":[]}})";
    if (p.find("/_bulk") != sv::npos)
        return R"({"took":0,"errors":false,"items":[]})";
    if (m == "DELETE")
        return R"({"acknowledged":true})";
    return R"({"acknowledged":true,"result":"created"})";
}

/** @brief Read headers + body so the client does not hang. */
void drain(int fd, std::string& req)
{
    char buf[4096];
    for (;;) {
        const auto hdr = req.find("\r\n\r\n");
        if (hdr != std::string::npos) {
            std::size_t want = 0;
            const auto cl = req.find("Content-Length:");
            if (cl != std::string::npos)
                want = std::stoul(req.substr(cl + 15));
            if (req.size() >= hdr + 4 + want)
                return;
        }
        const auto n = ::recv(fd, buf, sizeof(buf), 0);
        if (n <= 0)
            return;
        req.append(buf, static_cast<std::size_t>(n));
    }
}

} // namespace

int main()
{
    const int s = ::socket(AF_INET, SOCK_STREAM, 0);
    int yes = 1;
    ::setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &yes,
                 sizeof(yes));
    sockaddr_in a{};
    a.sin_family = AF_INET;
    a.sin_addr.s_addr = INADDR_ANY;
    a.sin_port = htons(kPort);
    if (::bind(s, reinterpret_cast<sockaddr*>(&a),
               sizeof(a)) < 0)
        return 1;
    ::listen(s, 64);
    for (;;) {
        const int c = ::accept(s, nullptr, nullptr);
        if (c < 0)
            continue;
        std::string req;
        drain(c, req);
        const auto s1 = req.find(' ');
        const auto s2 = req.find(' ', s1 + 1);
        if (s1 == std::string::npos
            || s2 == std::string::npos) {
            ::close(c);
            continue;
        }
        const std::string b = bodyFor(
            req.substr(0, s1),
            req.substr(s1 + 1, s2 - s1 - 1));
        const std::string r =
            "HTTP/1.1 200 OK\r\nContent-Type: "
            "application/json\r\nContent-Length: "
            + std::to_string(b.size())
            + "\r\nConnection: close\r\n\r\n" + b;
        ::send(c, r.data(), r.size(), 0);
        ::close(c);
    }
}
