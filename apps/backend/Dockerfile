FROM eclipse-temurin:17-jre
WORKDIR /app
COPY api/build/libs/*.jar feel-archive.jar
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar feel-archive.jar"]
