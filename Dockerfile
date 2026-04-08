# Spring Boot 3.4.x / JRE 21（与 pom.xml 中 java.version 一致）
# 工作目录必须为 /：Consts.ROOT_DIR 在 user.dir 为 / 时为空字符串，
# 日志、H2、扩展资源分别解析为 /logs、/database、/ext-resources（与 README 挂载说明一致）
FROM eclipse-temurin:21-jre-noble

ENV TZ=Asia/Shanghai \
    JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /

# finalName 为 ${project.artifactId}，即 team-nav.jar
COPY target/team-nav.jar app.jar

EXPOSE 8080

VOLUME ["/logs","/database","/ext-resources"]

ENV PARAMS=""

ENTRYPOINT ["sh", "-c", "java $PARAMS -jar app.jar"]
