---
fileID: oasisctl-revoke-apikey
title: Oasisctl Revoke Apikey
weight: 3210
description: 
layout: default
---
Revoke an API key with given identifier

## Synopsis

Revoke an API key with given identifier

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl revoke apikey [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --apikey-id string   Identifier of the API key to revoke
  -h, --help               help for apikey
```
{{% /tab %}}
{{< /tabs >}}

## Options inherited from parent commands

{{< tabs >}}
{{% tab name="" %}}
```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```
{{% /tab %}}
{{< /tabs >}}

## See also

* [oasisctl revoke]()	 - Revoke keys & tokens
* [oasisctl revoke apikey token](oasisctl-revoke-apikey-token)	 - Revoke an API key token

