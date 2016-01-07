FROM node:latest 

MAINTAINER Felipe Guerra

LABEL version="1.0.0"

RUN mkdir -p /apps/bin

WORKDIR /apps/bin

RUN git clone https://github.com/vsorganicos/VSOrganicosCore.git

WORKDIR /apps/bin/VSOrganicosCore

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]