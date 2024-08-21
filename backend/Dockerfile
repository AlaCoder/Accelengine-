FROM tomcat:9.0.45-jdk11

LABEL maintainer=”discovery”

COPY ./build/libs/ga.war /usr/local/tomcat/webapps/

ENV CATALINA_OPTS="-Xms512M -Xmx1G"

RUN sed -i 's/connectionTimeout="20000"/connectionTimeout="60000" useBodyEncodingForURI="true" socket.txBufSize="64000" socket.rxBufSize="64000"/' conf/server.xml

EXPOSE 8080

CMD ["catalina.sh", "run"]
