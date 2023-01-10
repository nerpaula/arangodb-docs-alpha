#Arangoproxy
FROM golang:1.19 AS arangoproxy

ARG BUILDARCH
RUN echo ${BUILDARCH}
ENV ARCH=${BUILDARCH}
CMD ["bash", "-c", "/home/scripts/$ARCH/start_arangoproxy.sh"]



FROM golang:1.19 AS hugo

RUN apt-get update && \
    apt-get install -y git curl

# download deb file
RUN curl -L https://github.com/gohugoio/hugo/releases/download/v0.109.0/hugo_0.109.0_linux-amd64.deb -o hugo.deb

# install
RUN apt-get install -y  ./*.deb

CMD ["bash", "-c", "/home/start_hugo.sh"]