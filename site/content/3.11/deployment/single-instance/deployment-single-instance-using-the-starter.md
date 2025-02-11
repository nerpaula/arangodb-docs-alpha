---
fileID: deployment-single-instance-using-the-starter
title: Using the ArangoDB Starter
weight: 785
description: 
layout: default
---
This section describes how to start an ArangoDB stand-alone instance using the tool
[_Starter_](../../programs-tools/arangodb-starter/) (the _arangodb_ binary program).

As a precondition you should create a _secret_ to activate authentication. The _Starter_ provides a handy
functionality to generate such a file:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb create jwt-secret --secret=arangodb.secret
```
{{% /tab %}}
{{< /tabs >}}

Set appropriate privilege on the generated _secret_ file, e.g. on Linux:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
chmod 400 arangodb.secret
```
{{% /tab %}}
{{< /tabs >}}

## Local Start

If you want to start a stand-alone instance of ArangoDB (single server), use the
`--starter.mode=single` option of the _Starter_: 

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.mode=single --auth.jwt-secret=/etc/arangodb.secret
```
{{% /tab %}}
{{< /tabs >}}

Please adapt the path to your _secret_ file accordingly.

## Using the ArangoDB Starter in Docker

The _Starter_ can also be used to launch a stand-alone instance based on _Docker_
containers:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.mode=single 
```
{{% /tab %}}
{{< /tabs >}}

If you use the Enterprise Edition Docker image, you have to set the license key
in an environment variable by adding this option to the above `docker` command:

{{< tabs >}}
{{% tab name="" %}}
```
    -e ARANGO_LICENSE_KEY=<thekey>
```
{{% /tab %}}
{{< /tabs >}}

You can get a free evaluation license key by visiting:

[www.arangodb.com/download-arangodb-enterprise/](https://www.arangodb.com/download-arangodb-enterprise/)

Then replace `<thekey>` above with the actual license key. The start
will then hand on the license key to the Docker container it launches
for ArangoDB.

### TLS verified Docker services

Oftentimes, one needs to harden Docker services using client certificate 
and TLS verification. The Docker API allows subsequently only certified access.
As the ArangoDB starter starts the ArangoDB cluster instances using this Docker API, 
it is mandatory that the ArangoDB starter is deployed with the proper certificates
handed to it, so that the above command is modified as follows:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
export DOCKER_TLS_VERIFY=1
export DOCKER_CERT_PATH=/path/to/certificate
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /path/to/certificate:/path/to/certificate
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.mode=single
```
{{% /tab %}}
{{< /tabs >}}

Note that the environment variables `DOCKER_TLS_VERIFY` and `DOCKER_CERT_PATH` 
as well as the additional mountpoint containing the certificate have been added above. 
directory. The assignment of `DOCKER_CERT_PATH` is optional, in which case it 
is mandatory that the certificates are stored in `$HOME/.docker`. So
the command would then be as follows

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /path/to/cert:/root/.docker \
    -e DOCKER_TLS_VERIFY=1 \
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.mode=single
```
{{% /tab %}}
{{< /tabs >}}

