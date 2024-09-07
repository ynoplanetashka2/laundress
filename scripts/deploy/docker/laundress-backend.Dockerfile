FROM node:22-alpine3.19

WORKDIR /laundress-frontend
RUN corepack enable
COPY ./ /laundress-frontend/
RUN yarn install --immutable
RUN yarn workspace laudnress-backend run build
