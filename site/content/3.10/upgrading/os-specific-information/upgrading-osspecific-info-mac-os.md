---
fileID: upgrading-osspecific-info-mac-os
title: Upgrading on macOS
weight: 1320
description: 
layout: default
---
This section describes upgrading an ArangoDB single-server installation, which
was installed via Homebrew or via the provided ArangoDB packages (*.dmg). 

## Upgrading via Homebrew

First update the homebrew repository:

{{< tabs >}}
{{% tab name="" %}}
```
brew update
```
{{% /tab %}}
{{< /tabs >}}

Then use **brew** to install the latest version of arangodb:

{{< tabs >}}
{{% tab name="" %}}
```
brew upgrade arangodb
```
{{% /tab %}}
{{< /tabs >}}

## Upgrading via Package

[Download](https://www.arangodb.com/download/) the latest ArangoDB macOS package and install it as usual by
mounting the `.dmg` file. Just drag and drop the `ArangoDB3-CLI` (community) or
the `ArangoDB3e-CLI` (enterprise) file into the shown `Applications` folder.
You will be asked if you want to replace the old file with the newer one.

![MacOSUpgrade](/images/MacOSUpgrade.png) 

Select `Replace` to install the current ArangoDB version.

## Upgrading more complex environments

The procedure described in this _Section_
is a first step to upgrade more complex deployments such as
[Cluster](../../deployment/cluster/)
or [Active Failover](../../deployment/active-failover/). 
