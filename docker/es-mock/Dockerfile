# Hacky Elasticsearch mock — a tiny C++ binary, no JVM.
# Replaces elasticsearch:8.17.0 (~1 GB JVM) on the constrained
# host. Backend's ES client talks to it unmodified.
FROM gcc:13 AS build
WORKDIR /b
COPY es_mock.cpp .
RUN g++ -O2 -std=c++20 -o es-mock es_mock.cpp

FROM debian:stable-slim
COPY --from=build /b/es-mock /usr/local/bin/es-mock
EXPOSE 9200
ENTRYPOINT ["/usr/local/bin/es-mock"]
