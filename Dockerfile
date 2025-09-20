FROM ubuntu:latest

RUN mkdir team-5-app
RUN apt update 
RUN apt install -y python3
RUN apt install -y python3.12-venv
RUN apt install -y npm

WORKDIR /opt
RUN python3 -m venv .env
RUN . /opt/.env/bin/activate \
    && pip install fastapi==0.116.1 \
    && pip install sqlmodel==0.0.24 \
    && pip install uvicorn==0.35.0 \
    && pip install phonemizer==3.3.0 \
    && pip install httpx \
    && pip install kanjiconv 

RUN echo "source /opt/.env/bin/activate && cd /team-5-app" >> /root/.bashrc

EXPOSE 8000

EXPOSE 3000

VOLUME /team-5-app
