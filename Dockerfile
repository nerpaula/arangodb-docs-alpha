#Arangoproxy
FROM golang:latest AS arangoproxy

RUN wget https://download.arangodb.com/arangodb310/Community/Linux/arangodb3-client_3.10.1-1_amd64.deb
RUN apt-get update
RUN apt-get install -y ./arangodb3*.deb

WORKDIR /home/arangoproxy/cmd
CMD ["go", "run", "main.go"]

# HUGO
FROM alpine:3.16 AS hugo-clone

RUN apk update && \
    apk add --no-cache ca-certificates git

RUN git clone https://github.com/gohugoio/hugo.git

#---------- Install and serve hugo

FROM golang:1.19-alpine AS hugo

COPY --from=hugo-clone /hugo ./hugo
WORKDIR hugo
RUN go install
WORKDIR /site
CMD [ "hugo", "serve", "--buildDrafts", "--watch", "--bind=0.0.0.0"]

# END HUGO



# ARANGO MAINTAINER MODE
FROM ubuntu:latest AS arango_maintainer


RUN apt-get update
RUN apt-get install -y aptitude
RUN aptitude -y update

RUN aptitude -y install git-core build-essential libssl-dev libjemalloc-dev cmake python3

RUN git clone $ARANGO_BRANCH --single-branch --depth 1 https://github.com/arangodb/arangodb.git

WORKDIR arangodb
RUN mkdir build
WORKDIR build
RUN cmake ..
RUN make
