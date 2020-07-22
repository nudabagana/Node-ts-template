FROM node:10.13.0 as build-env

WORKDIR /app

ADD tsconfig.json /app/tsconfig.json
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD swagger.config.yml /app/swagger.config.yml
RUN yarn install

ADD src /app/src
RUN yarn build
RUN yarn swagger

FROM node:10.13.0

WORKDIR /app

COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/yarn.lock /app/yarn.lock

RUN yarn install --production

COPY --from=build-env /app/dist /app/dist

CMD [ "yarn", "start" ]
