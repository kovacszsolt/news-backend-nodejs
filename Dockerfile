FROM alpine:3.8
RUN apk add --update nodejs nodejs-npm
COPY ./ /home/node/app
WORKDIR /home/node/app
EXPOSE 8090
RUN npm install
CMD node ./web.js
