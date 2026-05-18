/// @file imap_sync_folders_conn.cpp -- IMAP LIST.
#include "imap-sync/backend/imap_sync_folders.h"

#include <mailio/imap.hpp>

namespace services
{

// Flatten mailio's folder tree. mailio 0.23.0
// exposes only names, so delimiter defaults to
// "/" and flags is always [] (faithful port).
static void flatten(
    const mailio::imap::mailbox_folder_t& node,
    json& out)
{
    for (const auto& [name, child] : node.folders) {
        out.push_back({{"name", name},
                       {"delimiter", "/"},
                       {"flags", json::array()}});
        flatten(child, out);
    }
}

// Blocking connect + LIST (runs off the loop).
// "tls"/"starttls" -> imaps (TLS); else plain.
json imapListFolders(
    const std::string& host, int port,
    const std::string& user,
    const std::string& pass,
    const std::string& enc)
{
    json out = json::array();
    mailio::imap::mailbox_folder_t tree;
    // authenticate() must run on the concrete
    // type so imaps drives the TLS handshake.
    if (enc == "tls" || enc == "starttls") {
        mailio::imaps conn(host, port);
        if (!user.empty())
            conn.authenticate(
                user, pass,
                mailio::imaps::auth_method_t::LOGIN);
        tree = conn.list_folders("");
    } else {
        mailio::imap conn(host, port);
        if (!user.empty())
            conn.authenticate(
                user, pass,
                mailio::imap::auth_method_t::LOGIN);
        tree = conn.list_folders("");
    }
    flatten(tree, out);
    return out;
}

} // namespace services
