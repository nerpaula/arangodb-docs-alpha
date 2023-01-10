---
fileID: oasisctl-logs
title: Oasisctl Logs
weight: 3130
description: 
layout: default
---
Get logs of the servers of a deployment the authenticated user has access to

## Synopsis

Get logs of the servers of a deployment the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl logs [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -d, --deployment-id string     Identifier of the deployment
      --end string               End fetching logs at this timestamp (pass timestamp or duration before now)
  -h, --help                     help for logs
  -l, --limit int                Limit the number of log lines
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
  -r, --role string              Limit logs to servers with given role only (agents|coordinators|dbservers)
      --start string             Start fetching logs from this timestamp (pass timestamp or duration before now)
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

* [oasisctl](oasisctl-options)	 - ArangoDB Oasis

