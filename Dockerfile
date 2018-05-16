FROM node:8.9.0
MAINTAINER Paul Bachelerie <paulbachelerie@gmail.com>
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
COPY start.sh /
Run chmod 777 /start.sh
RUN apt-get update \
&& apt-get install -y ldap-utils libldap-2.4-2 libldap2-dev
RUN cd /tmp && yarn install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app
# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install -g quasar-cli
RUN npm run build
ENV PORT=80
EXPOSE 80

CMD /start.sh