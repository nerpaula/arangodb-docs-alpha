---
fileID: deployment-kubernetes-upgrading
title: Upgrading
weight: 910
description: 
layout: default
---
The ArangoDB Kubernetes Operator supports upgrading an ArangoDB from
one version to the next.

## Upgrade an ArangoDB deployment

To upgrade a cluster, change the version by changing
the `spec.image` setting and the apply the updated
custom resource using:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl apply -f yourCustomResourceFile.yaml
```
{{% /tab %}}
{{< /tabs >}}

The ArangoDB operator will perform an sequential upgrade
of all servers in your deployment. Only one server is upgraded
at a time.

For patch level upgrades (e.g. 3.9.2 to 3.9.3) each server
is stopped and restarted with the new version.

For minor level upgrades (e.g. 3.9.2 to 3.10.0) each server
is stopped, then the new version is started with `--database.auto-upgrade`
and once that is finish the new version is started with the normal arguments.

The process for major level upgrades depends on the specific version.

## Upgrade the operator itself

To update the ArangoDB Kubernetes Operator itself to a new version,
update the image version of the deployment resource
and apply it using:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl apply -f examples/yourUpdatedDeployment.yaml
```
{{% /tab %}}
{{< /tabs >}}

## See also

- [Scaling](deployment-kubernetes-scaling)