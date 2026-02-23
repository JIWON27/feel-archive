FROM eclipse-temurin:17-jre
WORKDIR /app
COPY api/build/libs/*.jar feel-archive.jar
ENTRYPOINT ["java", "-jar", "feel-archive.jar"]
