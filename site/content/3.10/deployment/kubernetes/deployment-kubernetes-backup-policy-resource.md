---
fileID: deployment-kubernetes-backup-policy-resource
title: ArangoBackupPolicy Custom Resource
weight: 880
description: 
layout: default
---
The ArangoBackupPolicy represents schedule definition for creating ArangoBackup Custom Resources by operator.
This deployment specification is a `CustomResource` following
a `CustomResourceDefinition` created by the operator.

## Examples:

### Create schedule for all deployments


{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
apiVersion: "backup.arangodb.com/v1"
kind: "ArangoBackupPolicy"
metadata:
  name: "example-arangodb-backup-policy"
spec:
  schedule: "*/15 * * * *"
```
{{% /tab %}}
{{< /tabs >}}

Action:

Create an ArangoBackup Custom Resource for each ArangoBackup every 15 minutes

### Create schedule for selected deployments


{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
apiVersion: "backup.arangodb.com/v1"
kind: "ArangoBackupPolicy"
metadata:
  name: "example-arangodb-backup-policy"
spec:
  schedule: "*/15 * * * *"
  selector:
    matchLabels:
      labelName: "labelValue"
```
{{% /tab %}}
{{< /tabs >}}

Action:

Create an ArangoBackup Custom Resource for selected ArangoBackup every 15 minutes

### Create schedule for all deployments and upload


{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
apiVersion: "backup.arangodb.com/v1"
kind: "ArangoBackupPolicy"
metadata:
  name: "example-arangodb-backup-policy"
spec:
  schedule: "*/15 * * * * "
  template:
      upload:
        repositoryURL: "s3:/..."
        credentialsSecretName: "secret-name"
```
{{% /tab %}}
{{< /tabs >}}

Create an ArangoBackup Custom Resource for each ArangoBackup every 15 minutes and upload to repositoryURL

## ArangoBackup Custom Resource Spec:

{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
apiVersion: "backup.arangodb.com/v1"
kind: "ArangoBackupPolicy"
metadata:
  name: "example-arangodb-backup-policy"
spec:
  schedule: "*/15 * * * * "
  selector:
    matchLabels:
      labelName: "labelValue"
    matchExpressions: []
  template:
      options:
        timeout: 3
        force: true
      upload:
        repositoryURL: "s3:/..."
        credentialsSecretName: "secret-name"
status:
  scheduled: "time"
  message: "message"
```
{{% /tab %}}
{{< /tabs >}}

## `spec: Object`

Spec of the ArangoBackupPolicy Custom Resource

Required: true

Default: {}

### `spec.schedule: String`

Schedule definition. Parser from https://godoc.org/github.com/robfig/cron

Required: true

Default: ""

### `spec.selector: Object`

Selector definition for selecting matching ArangoBackup Custom Resources. Parser from https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#LabelSelector

Required: false

Default: {}

### `spec.template: ArangoBackupTemplate`

Template for the ArangoBackup Custom Resource

Required: false

Default: {}

### `spec.template.options: ArangoBackup - spec.options`

ArangoBackup options

Required: false

Default: {}

### `spec.template.upload: ArangoBackup - spec.upload`

ArangoBackup upload configuration

Required: false

Default: {}

## `status: Object`

Status of the ArangoBackupPolicy Custom Resource managed by operator

Required: true

Default: {}

### `status.scheduled: TimeStamp`

Next scheduled time in UTC

Required: true

Default: ""

### `status.message: String`

Message from the operator in case of failure - schedule not valid, ArangoBackupPolicy not valid

Required: false

Default: ""