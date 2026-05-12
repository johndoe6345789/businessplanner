#pragma once
/**
 * @file launchpad_helpers.h
 * @brief Utility helpers for the LaunchPad
 *        metrics controller.
 */

#include <chrono>
#include <ctime>
#include <format>
#include <string>

namespace controllers
{

/**
 * @brief Build an ISO-8601 UTC timestamp string.
 * @return Current time as "YYYY-MM-DDThh:mm:ssZ".
 */
inline std::string isoNow()
{
    namespace sc = std::chrono;
    auto now = sc::system_clock::now();
    auto t   = sc::system_clock::to_time_t(now);
    std::tm tm{};
    gmtime_r(&t, &tm);
    return std::format(
        "{:04d}-{:02d}-{:02d}T"
        "{:02d}:{:02d}:{:02d}Z",
        tm.tm_year + 1900, tm.tm_mon + 1,
        tm.tm_mday,
        tm.tm_hour, tm.tm_min, tm.tm_sec);
}

} // namespace controllers
