FROM node:8.12
COPY ./source/ /home/node/app
WORKDIR /home/node/app
EXPOSE 8090
RUN npm install
CMD npm run start