---
fileID: oasisctl-create-deployment
title: Oasisctl Create Deployment
weight: 2530
description: 
layout: default
---
Create a new deployment

## Synopsis

Create a new deployment

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create deployment [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --accept                               Accept the current terms and conditions.
  -c, --cacertificate-id string              Identifier of the CA certificate to use for the deployment
      --coordinator-memory-size int32        Set memory size of coordinators for flexible deployments (GB) (default 4)
      --coordinators int32                   Set number of coordinators for flexible deployments (default 3)
      --custom-image string                  Set a custom image to use for the deployment. Only available for selected customers.
      --dbserver-disk-size int32             Set disk size of dbservers for flexible deployments (GB) (default 32)
      --dbserver-memory-size int32           Set memory size of dbservers for flexible deployments (GB) (default 4)
      --dbservers int32                      Set number of dbservers for flexible deployments (default 3)
      --description string                   Description of the deployment
      --disable-foxx-authentication          Disable authentication of requests to Foxx application.
      --disk-performance-id string           Set the disk performance to use for this deployment.
  -h, --help                                 help for deployment
  -i, --ipallowlist-id string                Identifier of the IP allowlist to use for the deployment
      --max-node-disk-size int32             Set maximum disk size for nodes for autoscaler (GB)
      --model string                         Set model of the deployment (default "oneshard")
      --name string                          Name of the deployment
      --node-count int32                     Set the number of desired nodes (default 3)
      --node-disk-size int32                 Set disk size for nodes (GB)
      --node-size-id string                  Set the node size to use for this deployment
      --notification-email-address strings   Set email address(-es) that will be used for notifications related to this deployment.
  -o, --organization-id string               Identifier of the organization to create the deployment in
  -p, --project-id string                    Identifier of the project to create the deployment in
  -r, --region-id string                     Identifier of the region to create the deployment in
      --version string                       Version of ArangoDB to use for the deployment
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

* [oasisctl create]()	 - Create resources

