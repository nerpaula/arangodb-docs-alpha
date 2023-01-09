#Arangoproxy
FROM golang:latest AS arangoproxy

ARG BUILDARCH
RUN echo ${BUILDARCH}

WORKDIR /home/scripts/${BUILDARCH}

RUN apt-get update

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
CMD [ "hugo"]

# END HUGO
