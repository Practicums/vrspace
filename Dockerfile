FROM debian:latest
 #Install git, bash, java, maven, curl, nano, npm, nodejs
RUN apt update && apt install -y \
 git \
 bash-completion \
 default-jdk\
 maven\
 curl\
 nano\
 npm\
 nodejs

COPY . /home/vrspace/

WORKDIR /home/vrspace/server
RUN mvn clean install

#Set working directory
WORKDIR /home/vrspace/server/target/

CMD java -jar server-0.4.7-SNAPSHOT.jar

EXPOSE 4001
EXPOSE 4002
EXPOSE 4003
EXPOSE 8002
EXPOSE 8003
EXPOSE 8080
EXPOSE 8443


