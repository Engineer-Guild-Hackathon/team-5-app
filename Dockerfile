FROM ubuntu:latest

RUN mkdir TEAM-5-APP \
    && apt update \
    && apt upgrade -y \
    && apt install -y python3 python3-pip npm\
    && pip install -y fastapi==0.116.1 \
    && pip install -y sqlmodel==0.0.24 \
    && apt install -y mysql-server mysql-client

EXPOSE 8000

EXPOSE 3000

VOLUME /TEAM-5-APP