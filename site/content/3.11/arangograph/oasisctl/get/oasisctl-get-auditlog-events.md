---
fileID: oasisctl-get-auditlog-events
title: Oasisctl Get Auditlog Events
weight: 2760
description: 
layout: default
---
Get auditlog events

## Synopsis

Get auditlog events

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl get auditlog events [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --auditlog-archive-id string   If set, include only events from this AuditLogArchive
  -i, --auditlog-id string           Identifier of the auditlog
      --excluded-topics strings      If non-empty, leave out events with one of these topics. This takes priority over included
      --from string                  Request events created at or after this timestamp
  -h, --help                         help for events
      --included-topics strings      If non-empty, only request events with one of these topics
      --limit int                    Limit the number of audit log events. Defaults to 0, meaning no limit
      --to string                    Request events created before this timestamp
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

* [oasisctl get auditlog](oasisctl-get-auditlog)	 - Get auditlog archive

