FROM node:10-slim

RUN mkdir -p /usr/src/garie-lighthouse
WORKDIR /usr/src/garie-lighthouse

COPY package.json .
COPY config.json .
COPY .babelrc .
COPY src ./src
COPY bin ./bin

RUN npm install --only=production

RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list


RUN apt-get update -qqy \
  && apt-get -qqy install libnss3 libnss3-tools libfontconfig1 wget ca-certificates apt-transport-https inotify-tools gnupg2 curl \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Install Google Chrome
RUN curl -sL https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
              /tmp/*
# @end Install Google Chrome

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb
RUN dpkg -i dumb-init_*.deb

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

EXPOSE 3000

CMD ["npm", "start"]
