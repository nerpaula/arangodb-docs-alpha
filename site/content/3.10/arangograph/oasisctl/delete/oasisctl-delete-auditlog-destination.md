---
fileID: oasisctl-delete-auditlog-destination
title: Oasisctl Delete Auditlog Destination
weight: 2605
description: 
layout: default
---
Delete a destination from an auditlog

## Synopsis

Delete a destination from an auditlog

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete auditlog destination [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-id string       Identifier of the auditlog to delete.
  -h, --help                     help for destination
      --index int                Index of the destination to remove. Only one delete option can be specified. (default -1)
  -o, --organization-id string   Identifier of the organization.
      --type string              Type of the destination to remove. This will remove ALL destinations with that type.
      --url string               An optional URL which will be used to delete a single destination instead of all.
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

* [oasisctl delete auditlog](oasisctl-delete-auditlog)	 - Delete an auditlog

