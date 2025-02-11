---
fileID: go-connection-management
title: ArangoDB GO Driver - Connection Management
weight: 3930
description: 
layout: default
---
## Failover 

The driver supports multiple endpoints to connect to. All request are in principle 
send to the same endpoint until that endpoint fails to respond. 
In that case a new endpoint is chosen and the operation is retried.

The following example shows how to connect to a cluster of 3 servers.

{{< tabs >}}
{{% tab name="go" %}}
```go
conn, err := http.NewConnection(http.ConnectionConfig{
    Endpoints: []string{"http://server1:8529", "http://server2:8529", "http://server3:8529"},
})
if err != nil {
    // Handle error
}
client, err := driver.NewClient(driver.ClientConfig{
    Connection: conn,
})
if err != nil {
    // Handle error
}
```
{{% /tab %}}
{{< /tabs >}}

Note that a valid endpoint is an URL to either a standalone server, or a URL to a Coordinator 
in a cluster.

## Failover: Exact behavior

The driver monitors the request being send to a specific server (endpoint). 
As soon as the request has been completely written, failover will no longer happen.
The reason for that is that several operations cannot be (safely) retried.
E.g. when a request to create a document has been send to a server and a timeout 
occurs, the driver has no way of knowing if the server did or did not create
the document in the database.

If the driver detects that a request has been completely written, but still gets 
an error (other than an error response from Arango itself), it will wrap the 
error in a `ResponseError`. The client can test for such an error using `IsResponseError`.

If a client received a `ResponseError`, it can do one of the following:
- Retry the operation and be prepared for some kind of duplicate record / unique constraint violation.
- Perform a test operation to see if the "failed" operation did succeed after all.
- Simply consider the operation failed. This is risky, since it can still be the case that the operation did succeed.

## Failover: Timeouts

To control the timeout of any function in the driver, you must pass it a context 
configured with `context.WithTimeout` (or `context.WithDeadline`).

In the case of multiple endpoints, the actual timeout used for requests will be shorter than 
the timeout given in the context.
The driver will divide the timeout by the number of endpoints with a maximum of 3.
This ensures that the driver can try up to 3 different endpoints (in case of failover) without 
being canceled due to the timeout given by the client.
E.g.
- With 1 endpoint and a given timeout of 1 minute, the actual request timeout will be 1 minute.
- With 3 endpoints and a given timeout of 1 minute, the actual request timeout will be 20 seconds.
- With 8 endpoints and a given timeout of 1 minute, the actual request timeout will be 20 seconds.

For most requests you want a actual request timeout of at least 30 seconds.

## Secure connections (SSL)

The driver supports endpoints that use SSL using the `https` URL scheme.

The following example shows how to connect to a server that has a secure endpoint using 
a self-signed certificate.

{{< tabs >}}
{{% tab name="go" %}}
```go
conn, err := http.NewConnection(http.ConnectionConfig{
    Endpoints: []string{"https://localhost:8529"},
    TLSConfig: &tls.Config{InsecureSkipVerify: true},
})
if err != nil {
    // Handle error
}
client, err := driver.NewClient(driver.ClientConfig{
    Connection: conn,
})
if err != nil {
    // Handle error
}
```
{{% /tab %}}
{{< /tabs >}}

## Connection Pooling

The driver has a built-in connection pooling and the connection limit
(`connLimit`) defaults to 32.

{{< tabs >}}
{{% tab name="go" %}}
```go
conn, err := http.NewConnection(http.ConnectionConfig{
    Endpoints: []string{"https://localhost:8529"},
    connLimit: 32,
})
```
{{% /tab %}}
{{< /tabs >}}

{{% hints/info %}}
Opening and closing connections very frequently can exhaust the amount of
connections allowed by the operating system. TCP connections enter a special
state `WAIT_TIME` after close, and typically remain in this state for two
minutes (maximum segment life * 2). These connections count towards the global
limit, which depends on the operating system but is usually around 28,000.
Connections should thus be reused as much as possible.

You may run into this problem if you bypass the driver's safe guards by
setting a very high connection limit or by using multiple connection objects
and thus pools.
{{% /hints/info %}}
