---
fileID: oasisctl-lock
title: Oasisctl Lock
weight: 3090
description: 
layout: default
---
Lock resources

## Synopsis

Lock resources

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl lock [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help   help for lock
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

* [oasisctl](../oasisctl-options)	 - ArangoDB Oasis
* [oasisctl lock cacertificate](oasisctl-lock-cacertificate)	 - Lock a CA certificate, so it cannot be deleted
* [oasisctl lock deployment](oasisctl-lock-deployment)	 - Lock a deployment, so it cannot be deleted
* [oasisctl lock ipallowlist](oasisctl-lock-ipallowlist)	 - Lock an IP allowlist, so it cannot be deleted
* [oasisctl lock organization](oasisctl-lock-organization)	 - Lock an organization, so it cannot be deleted
* [oasisctl lock policy](oasisctl-lock-policy)	 - Lock a backup policy
* [oasisctl lock project](oasisctl-lock-project)	 - Lock a project, so it cannot be deleted

