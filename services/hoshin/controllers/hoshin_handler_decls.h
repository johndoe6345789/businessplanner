#pragma once
/**
 * @file hoshin_handler_decls.h
 * @brief Method declarations for HoshinController.
 *        Pasted into the class body via macro.
 */

using Req = drogon::HttpRequestPtr;
using Cb  = std::function<void(
    const drogon::HttpResponsePtr&)>;

#define HOSHIN_HANDLER_DECLS \
    void listObjectives(const Req&, Cb&&); \
    void createObjective(const Req&, Cb&&); \
    void deleteObjective( \
        const Req&, Cb&&, std::string id); \
    void listLinks(const Req&, Cb&&); \
    void createLink(const Req&, Cb&&); \
    void deleteLink( \
        const Req&, Cb&&, std::string id);
