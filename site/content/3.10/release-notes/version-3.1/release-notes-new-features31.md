---
fileID: release-notes-new-features31
title: Features and Improvements in ArangoDB 3.1
weight: 11695
description: 
layout: default
---
### Functions added

The following AQL functions have been added in 3.1:

- *OUTERSECTION(array1, array2, ..., arrayn)*: returns the values that occur
  only once across all arrays specified.

- *DISTANCE(lat1, lon1, lat2, lon2)*: returns the distance between the two
  coordinates specified by *(lat1, lon1)* and *(lat2, lon2)*. The distance is
  calculated using the haversine formula.

- *JSON_STRINGIFY(value)*: returns a JSON string representation of the value.

- *JSON_PARSE(value)*: converts a JSON-encoded string into a regular object


### Index usage in traversals

3.1 allows AQL traversals to use other indexes than just the edge index.
Traversals with filters on edges can now make use of more specific indexes. For
example, the query

    FOR v, e, p IN 2 OUTBOUND @start @@edge
      FILTER p.edges[0].foo == "bar"
      RETURN [v, e, p]

may use a hash index on `["_from", "foo"]` instead of the edge index on just
`["_from"]`.


### Optimizer improvements

Make the AQL query optimizer inject filter condition expressions referred to
by variables during filter condition aggregation. For example, in the following
query

    FOR doc IN collection
      LET cond1 = (doc.value == 1)
      LET cond2 = (doc.value == 2)
      FILTER cond1 || cond2
      RETURN { doc, cond1, cond2 }

the optimizer will now inject the conditions for `cond1` and `cond2` into the
filter condition `cond1 || cond2`, expanding it to `(doc.value == 1) || (doc.value == 2)`
and making these conditions available for index searching.

Note that the optimizer previously already injected some conditions into other
conditions, but only if the variable that defined the condition was not used elsewhere.
For example, the filter condition in the query

    FOR doc IN collection
      LET cond = (doc.value == 1)
      FILTER cond
      RETURN { doc }

already got optimized before because `cond` was only used once in the query and the
optimizer decided to inject it into the place where it was used.

This only worked for variables that were referred to once in the query. When a variable
was used multiple times, the condition was not injected as in the following query

    FOR doc IN collection
      LET cond = (doc.value == 1)
      FILTER cond
      RETURN { doc, cond }

3.1 allows using this condition so that the query can use an index on `doc.value`
(if such index exists).


### Miscellaneous improvements

The performance of the `[*]` operator was improved for cases in which this operator
did not use any filters, projections and/or offset/limits.

The AQL query executor can now report the time required for loading and locking the
collections used in an AQL query. When profiling is enabled, it will report the total
loading and locking time for the query in the `loading collections` sub-attribute of the
`extra.profile` value of the result. The loading and locking time can also be view in the
AQL query editor in the web interface.

## Audit Log

Audit logging has been added, see [Auditing](../../security/auditing/).

## Client tools

Added option `--skip-lines` for arangoimp
This allows skipping the first few lines from the import file in case the CSV or TSV
import are used and some initial lines should be skipped from the input.

## Web Admin Interface

The usability of the AQL editor significantly improved. In addition to the standard JSON
output, the AQL Editor is now able to render query results as a graph preview or a table.
Furthermore the AQL editor displays query profiling information.

Added a new Graph Viewer in order to exchange the technically obsolete version. The new Graph
Viewer is based on Canvas but does also include a first WebGL implementation (limited
functionality - will change in the future). The new Graph Viewer offers a smooth way to
discover and visualize your graphs.

The shard view in cluster mode now displays a progress indicator while moving shards.

## Authentication

Up to ArangoDB 3.0 authentication of client requests was only possible with HTTP basic
authentication.

Starting with 3.1 it is now possible to also use a [JSON Web Tokens](https://jwt.io/)
(JWT) for authenticating incoming requests.

For details check the HTTP authentication chapter. Both authentication methods are
valid and will be supported in the near future. Use whatever suits you best.

## Foxx

### GraphQL

It is now easy to get started with providing GraphQL APIs in Foxx, see [Foxx GraphQL](../../foxx-microservices/reference/related-modules/foxx-reference-modules-graph-ql).

### OAuth2

Foxx now officially provides a module for implementing OAuth2 clients, see [Foxx OAuth2](../../foxx-microservices/reference/related-modules/foxx-reference-modules-oauth2).

### Per-route middleware

It's now possible to specify middleware functions for a route when defining a route handler. These middleware functions only apply to the single route and share the route's parameter definitions. Check out the [Foxx Router documentation](../../foxx-microservices/reference/routers/) for more information.
