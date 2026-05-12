/// @file UrlBuilder.cpp — esIndex -> frontend URL.
/// Maps the 4 LaunchPad ES indexes to their
/// frontend page routes and logical type labels.
#include "search/backend/UrlBuilder.h"

namespace services
{

namespace
{

std::string strField(const json& src,
                     const std::string& k)
{
    auto it = src.find(k);
    if (it == src.end() || !it->is_string()) {
        return {};
    }
    return it->get<std::string>();
}

} // namespace

std::string UrlBuilder::build(
    const std::string& esIndex,
    const std::string& id, const json& src)
{
    if (esIndex == "launchpad-kb") {
        auto ct = strField(src, "content_type");
        auto st = strField(src, "startup_type");
        // /knowledge/<startup-type>/<id>
        // e.g. /knowledge/saas/42
        std::string base = "/knowledge";
        if (!st.empty()) base += "/" + st;
        return base + "/" + id;
    }
    if (esIndex == "launchpad-planner") {
        auto st = strField(src, "startup_type");
        auto step = strField(src, "step_id");
        // /planner/<startup-type>?step=<step_id>
        std::string base = "/planner";
        if (!st.empty()) base += "/" + st;
        if (!step.empty())
            base += "?step=" + step;
        return base;
    }
    if (esIndex == "launchpad-community") {
        auto tid = strField(src, "target_id");
        // /community/threads/<target_id>
        return "/community/threads/" +
               (tid.empty() ? id : tid);
    }
    if (esIndex == "launchpad-founders") {
        auto u = strField(src, "username");
        // /u/<username>
        return "/u/" + (u.empty() ? id : u);
    }
    return "#";
}

std::string UrlBuilder::typeOf(
    const std::string& esIndex)
{
    if (esIndex == "launchpad-kb")
        return "kb_content";
    if (esIndex == "launchpad-planner")
        return "planner_steps";
    if (esIndex == "launchpad-community")
        return "community_posts";
    if (esIndex == "launchpad-founders")
        return "founders";
    return esIndex;
}

} // namespace services
