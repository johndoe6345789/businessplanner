/**
 * @file MigrationFileUtils.cpp
 * @brief File-system utilities for SQL migration files.
 */

#include "migration-runner/backend/MigrationFileUtils.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <stdexcept>

namespace fs = std::filesystem;

namespace services
{

auto MigrationFileUtils::discoverFiles(const std::string& dir)
    -> std::vector<std::string>
{
    std::vector<std::string> files;
    if (!fs::exists(dir) || !fs::is_directory(dir)) {
        spdlog::debug("Migrations directory not found: {}", dir);
        return files;
    }

    for (const auto& entry : fs::directory_iterator(dir)) {
        if (entry.is_regular_file() && entry.path().extension() == ".sql") {
            files.push_back(entry.path().filename().string());
        }
    }
    std::ranges::sort(files);
    return files;
}

auto MigrationFileUtils::readFile(const std::string& path) -> std::string
{
    std::ifstream ifs(path);
    if (!ifs.is_open()) {
        throw std::runtime_error(fmt::format("Cannot open file: {}", path));
    }
    std::ostringstream ss;
    ss << ifs.rdbuf();
    return ss.str();
}

auto MigrationFileUtils::extractUp(const std::string& sql) -> std::string
{
    auto pos = sql.find("-- DOWN");
    if (pos == std::string::npos) {
        return sql;
    }
    return sql.substr(0, pos);
}

auto MigrationFileUtils::extractDown(const std::string& sql) -> std::string
{
    auto pos = sql.find("-- DOWN");
    if (pos == std::string::npos) {
        return {};
    }
    auto lineEnd = sql.find('\n', pos);
    if (lineEnd == std::string::npos) {
        return {};
    }
    return sql.substr(lineEnd + 1);
}

auto MigrationFileUtils::splitStatements(const std::string& sql)
    -> std::vector<std::string>
{
    std::vector<std::string> stmts;
    std::string cur;
    for (const char c : sql) {
        if (c == ';') {
            auto s = cur.find_first_not_of(" \t\r\n");
            if (s != std::string::npos)
                stmts.push_back(cur.substr(s));
            cur.clear();
        } else {
            cur += c;
        }
    }
    // Handle any trailing content without a semicolon
    auto s = cur.find_first_not_of(" \t\r\n");
    if (s != std::string::npos)
        stmts.push_back(cur.substr(s));
    return stmts;
}

} // namespace services
