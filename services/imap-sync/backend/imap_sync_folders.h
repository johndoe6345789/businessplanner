#pragma once
/// @file imap_sync_folders.h
/// @brief Blocking IMAP folder LIST helper.

#include "imap-sync/backend/imap_sync_types.h"

#include <string>

namespace services
{

/// @brief Connect (TLS per enc) and LIST folders;
/// returns a JSON array [{name,delimiter,flags}].
[[nodiscard]] json imapListFolders(
    const std::string& host, int port,
    const std::string& user,
    const std::string& pass,
    const std::string& enc);

} // namespace services
