/** @brief businessplanner-content microservice entry point. */
#include "service-host/ServiceApp.h"

int main(int argc, char* argv[])
{
    const char* cfg = argc > 1
        ? argv[1] : "config/config.json";
    services::runService(cfg, "businessplanner-content");
    return 0;
}
