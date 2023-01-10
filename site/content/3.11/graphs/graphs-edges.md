---
fileID: graphs-edges
title: Edges, Identifiers, Handles
weight: 695
description: 
layout: default
---
This is an introduction to ArangoDB's interface for edges.
Edges may be [used in graphs]().
Here we work with edges from the JavaScript shell *arangosh*.
For other languages see the corresponding language API.

A graph data model always consists of at least two collections: the relations between the
nodes in the graphs are stored in an "edges collection", the nodes in the graph
are stored in documents in regular collections.

Edges in ArangoDB are special documents. In addition to the system
attributes `_key`, `_id` and `_rev`, they have the attributes `_from` and `_to`, 
which contain [document handles](../appendix/appendix-glossary#document-handle), namely the start-point and the end-point of the edge.

**Example**

- The "edge" collection stores the information that a company's reception is sub-unit to the services unit and the services unit is sub-unit to the
  CEO. You would express this relationship with the `_from` and `_to` attributes
- The "normal" collection stores all the properties about the reception, e.g. that 20 people are working there and the room number etc
- `_from` is the [document handle](../appendix/appendix-glossary#document-handle) of the linked vertex (incoming relation)
- `_to` is the document handle of the linked vertex (outgoing relation)

[Edge collections](../appendix/appendix-glossary#edge-collection) are special collections that store edge documents. Edge documents 
are connection documents that reference other documents. The type of a collection 
must be specified when a collection is created and cannot be changed afterwards.

To change edge endpoints you can simply update the `_from` and `_to` attributes
like any other document attribute.

## Working with Edges

Edges are normal [documents](../getting-started/data-model-concepts/documents/data-modeling-documents-document-methods#edges)
that always contain a `_from` and a `_to` attribute.
