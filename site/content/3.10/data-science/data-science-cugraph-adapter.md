---
fileID: data-science-cugraph-adapter
title: cuGraph Adapter
weight: 725
description: >- 
  The ArangoDB-cuGraph Adapter exports graphs from ArangoDB into RAPIDS cuGraph, a library of collective GPU-accelerated graph algorithms, and vice-versa
layout: default
---
While offering a similar API and set of graph algorithms to NetworkX,
[RAPIDS cuGraph](https://docs.rapids.ai/api/cugraph/stable/)
library is GPU-based. Especially for large graphs, this
results in a significant performance improvement of cuGraph compared to NetworkX.
Please note that storing node attributes is currently not supported by cuGraph.
In order to run cuGraph, an Nvidia-CUDA-enabled GPU is required.

## Resources

The [ArangoDB-cuGraph Adapter repository](https://github.com/arangoml/cugraph-adapter)
is available on Github. Check it out!

## Installation

To install the latest release of the ArangoDB-cuGraph Adapter,
run the following command:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
conda install -c arangodb adbcug-adapter
```
{{% /tab %}}
{{< /tabs >}}

## Quickstart

The following examples show how to get started with ArangoDB-cuGraph Adapter.
Check also the 
[interactive tutorial](https://colab.research.google.com/github/arangoml/cugraph-adapter/blob/master/examples/ArangoDB_cuGraph_Adapter.ipynb).

{{< tabs >}}
{{% tab name="py" %}}
```py
import cudf
import cugraph
from arango import ArangoClient # Python-Arango driver

from adbcug_adapter import ADBCUG_Adapter


db = ArangoClient(hosts="http://localhost:8529").db("_system", username="root", password="")

adbcug_adapter = ADBCUG_Adapter(db)


cug_fraud_graph = adbcug_adapter.arangodb_graph_to_cugraph("fraud-detection")


cug_fraud_graph_2 = adbcug_adapter.arangodb_collections_to_cugraph(
    "fraud-detection",
    {"account", "bank", "branch", "Class", "customer"},  #  Vertex collections
    {"accountHolder", "Relationship", "transaction"},  # Edge collections
)


## 1) Create a sample cuGraph
cug_divisibility_graph = cugraph.MultiGraph(directed=True)
cug_divisibility_graph.from_cudf_edgelist(
    cudf.DataFrame(
        [
            (f"numbers/{j}", f"numbers/{i}", j / i)
            for i in range(1, 101)
            for j in range(1, 101)
            if j % i == 0
        ],
        columns=["src", "dst", "weight"],
    ),
    source="src",
    destination="dst",
    edge_attr="weight",
    renumber=False,
)

## 2) Create ArangoDB Edge Definitions
edge_definitions = [
    {
        "edge_collection": "is_divisible_by",
        "from_vertex_collections": ["numbers"],
        "to_vertex_collections": ["numbers"],
    }
]

## 3) Convert cuGraph to ArangoDB
adb_graph = adbcug_adapter.cugraph_to_arangodb("DivisibilityGraph", cug_graph, edge_definitions)
```
{{% /tab %}}
{{< /tabs >}}