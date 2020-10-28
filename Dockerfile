# build stage
FROM node:lts-alpine as build-stage
ARG MODE
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build -- --mode $MODE

# production stage
FROM nginx:stable-alpine as production-stage
ENV TZ 'Asia/Ho_Chi_Minh'

COPY --from=build-stage /app/dist /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]