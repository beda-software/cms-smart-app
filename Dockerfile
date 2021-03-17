### STAGE 2: Production Environment ###
FROM nginx:1.19.8-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

ARG DIST_PATH

RUN echo $DIST_PATH

COPY $DIST_PATH .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]