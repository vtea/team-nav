# syntax=docker/dockerfile:1
# 多阶段构建：在项目根目录执行 `docker build -t team-nav:local .` 即可完成前端、Maven 与运行镜像。
# 运行阶段 WORKDIR 必须为 /：Consts.ROOT_DIR 在 user.dir 为 / 时为空，日志与数据目录为 /logs、/database、/ext-resources。

# -----------------------------------------------------------------------------
# 阶段 1：构建 Vue 前端
# -----------------------------------------------------------------------------
FROM node:20-bookworm AS frontend
WORKDIR /build/web

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# 阶段 2：Maven 打包（将 web/dist 写入 target/classes/static 后再 package）
# -----------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /build

COPY pom.xml .
COPY src ./src
COPY --from=frontend /build/web/dist ./web/dist

RUN mvn -B -DskipTests clean compile \
    && mkdir -p target/classes/static \
    && cp -rf web/dist/* target/classes/static/ \
    && mvn -B -DskipTests package

# -----------------------------------------------------------------------------
# 阶段 3：仅含 JRE 的运行镜像
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-noble

ENV TZ=Asia/Shanghai \
    JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /

COPY --from=backend /build/target/team-nav.jar app.jar

EXPOSE 8080

VOLUME ["/logs","/database","/ext-resources"]

ENV PARAMS=""

ENTRYPOINT ["sh", "-c", "java $PARAMS -jar app.jar"]
