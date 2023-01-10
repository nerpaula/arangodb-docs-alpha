---
fileID: oasisctl-update-policy-add-binding
title: Oasisctl Update Policy Add Binding
weight: 3380
description: 
layout: default
---
Add a role binding to a policy

## Synopsis

Add a role binding to a policy

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update policy add binding [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --group-id strings   Identifiers of the groups to add bindings for
  -h, --help               help for binding
  -r, --role-id string     Identifier of the role to bind to
  -u, --url string         URL of the resource to update the policy for
      --user-id strings    Identifiers of the users to add bindings for
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

* [oasisctl update policy add](oasisctl-update-policy-add)	 - Add to a policy

