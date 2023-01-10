---
fileID: release-notes-upgrading-changes23
title: Incompatible changes in ArangoDB 2.3
weight: 11805
description: 
layout: default
---
### AQL queries throw less exceptions

ArangoDB 2.3 contains a completely rewritten AQL query optimizer and execution 
engine. This means that AQL queries will be executed with a different engine than
in ArangoDB 2.2 and earlier. Parts of AQL queries might be executed in different 
order than before because the AQL optimizer has more freedom to move things 
around in a query.

In previous versions of ArangoDB, AQL queries aborted with an exception in many
situations and threw a runtime exception. Exceptions were thrown when trying to
find a value using the `IN` operator in a non-array element, when trying to use
non-boolean values with the logical operands `&&` or `||` or `!`, when using non-numeric
values in arithmetic operations, when passing wrong parameters into functions etc.

In ArangoDB 2.3 this has been changed in many cases to make AQL more user-friendly
and to allow the optimization to perform much more query optimizations.

Here is a summary of changes:
- when a non-array value is used on the right-hand side of the `IN` operator, the 
  result will be `false` in ArangoDB 2.3, and no exception will be thrown.
- the boolean operators `&&` and `||` do not throw in ArangoDB 2.3 if any of the
  operands is not a boolean value. Instead, they will perform an implicit cast of
  the values to booleans. Their result will be as follows:
  - `lhs && rhs` will return `lhs` if it is `false` or would be `false` when converted
    into a boolean. If `lhs` is `true` or would be `true` when converted to a boolean,
    `rhs` will be returned.
  - `lhs || rhs` will return `lhs` if it is `true` or would be `true` when converted
    into a boolean. If `lhs` is `false` or would be `false` when converted to a boolean,
    `rhs` will be returned.
  - `! value` will return the negated value of `value` converted into a boolean
- the arithmetic operators (`+`, `-`, `*`, `/`, `%`) can be applied to any value and 
  will not throw exceptions when applied to non-numeric values. Instead, any value used
  in these operators will be casted to a numeric value implicitly. If no numeric result
  can be produced by an arithmetic operator, it will return `null` in ArangoDB 2.3. This
  is also true for division by zero. 
- passing arguments of invalid types into AQL functions does not throw a runtime
  exception in most cases, but may produce runtime warnings. Built-in AQL functions that 
  receive invalid arguments will then return `null`.


### Nested FOR loop execution order

The query optimizer in 2.3 may permute the order of nested `FOR` loops in AQL queries,
provided that exchanging the loops will not alter a query result. However, a change
in the order of returned values is allowed because no sort order is guaranteed by AQL
(and was never) unless an explicit `SORT` statement is used in a query.


### Changed return values of ArangoQueryCursor.getExtra()

The return value of `ArangoQueryCursor.getExtra()` has been changed in ArangoDB 2.3.
It now contains a `stats` attribute with statistics about the query previously executed.
It also contains a `warnings` attribute with warnings that happened during query
execution. The return value structure has been unified in 2.3 for both read-only and
data-modification queries.

The return value looks like this for a read-only query:

{{< tabs >}}
{{% tab name="" %}}
```
arangosh> stmt = db._createStatement("FOR i IN mycollection RETURN i"); stmt.execute().getExtra()
{ 
  "stats" : { 
    "writesExecuted" : 0, 
    "writesIgnored" : 0, 
    "scannedFull" : 2600, 
    "scannedIndex" : 0 
  }, 
  "warnings" : [ ] 
}
```
{{% /tab %}}
{{< /tabs >}}

For data-modification queries, ArangoDB 2.3 returns a result with the same structure:

{{< tabs >}}
{{% tab name="" %}}
```
arangosh> stmt = db._createStatement("FOR i IN xx REMOVE i IN xx"); stmt.execute().getExtra()
{ 
  "stats" : { 
    "writesExecuted" : 2600, 
    "writesIgnored" : 0, 
    "scannedFull" : 2600, 
    "scannedIndex" : 0 
  }, 
  "warnings" : [ ] 
}
```
{{% /tab %}}
{{< /tabs >}}

In ArangoDB 2.2, the return value of `ArangoQueryCursor.getExtra()` was empty for read-only
queries and contained an attribute `operations` with two sub-attributes for data-modification 
queries:

{{< tabs >}}
{{% tab name="" %}}
```
arangosh> stmt = db._createStatement("FOR i IN mycollection RETURN i"); stmt.execute().getExtra()
{ 
}
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="" %}}
```
arangosh> stmt = db._createStatement("FOR i IN mycollection REMOVE i IN mycollection"); stmt.execute().getExtra()
{ 
  "operations" : { 
    "executed" : 2600, 
    "ignored" : 0 
  } 
}
```
{{% /tab %}}
{{< /tabs >}}

### Changed return values in HTTP method `POST /_api/cursor`

The previously mentioned change also leads to the statistics being returned in the
HTTP REST API method `POST /_api/cursor`. Previously, the return value contained
an optional `extra` attribute that was filled only for data-modification queries and in 
some other cases as follows:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "result" : [ ],
  "hasMore" : false,
  "extra" : {
    "operations" : {
      "executed" : 2600,
      "ignored" : 0
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}

With the changed result structure in ArangoDB 2.3, the `extra` attribute in the result
will look like this:

{{< tabs >}}
{{% tab name="" %}}
```
{ 
  "result" : [],
  "hasMore" : false,
  "extra" : {
    "stats" : {
      "writesExecuted" : 2600,
      "writesIgnored" : 0,
      "scannedFull" : 0,
      "scannedIndex" : 0
    },
    "warnings" : [ ]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

If the query option `fullCount` is requested, the `fullCount` result value will also
be returned inside the `stats` attribute of the `extra` attribute, and not directly
as an attribute inside the `extra` attribute as in 2.2. Note that a `fullCount` will
only be present in `extra`.`stats` if it was requested as an option for the query.

The result in ArangoDB 2.3 will also contain a `warnings` attribute with the array of 
warnings that happened during query execution.


### Changed return values in ArangoStatement.explain()

The return value of `ArangoStatement.explain()` has changed significantly in 
ArangoDB 2.3. The new return value structure is not compatible with the structure
returned by 2.2.

In ArangoDB 2.3, the full execution plan for an AQL query is returned alongside all 
applied optimizer rules, optimization warnings etc. It is also possible to have the 
optimizer return all execution plans. This required a new data structure.

Client programs that use `ArangoStatement.explain()` or the HTTP REST API method
`POST /_api/explain` may need to be adjusted to use the new return format.


The return value of `ArangoStatement.parse()` has been extended in ArangoDB 2.3.
In addition to the existing attributes, ArangoDB 2.3 will also return an `ast` attribute
containing the abstract syntax tree of the statement. This extra attribute can
safely be ignored by client programs.


### Variables not updatable in queries

Previous versions of ArangoDB allowed the modification of variables inside AQL 
queries, e.g.

{{< tabs >}}
{{% tab name="" %}}
```
LET counter = 0
FOR i IN 1..10 
  LET counter = counter + 1
  RETURN counter
```
{{% /tab %}}
{{< /tabs >}}

While this is admittedly a convenient feature, the new query optimizer design did not
allow to keep it. Additionally, updating variables inside a query would prevent a lot
of optimizations to queries that we would like the optimizer to make. Additionally,
updating variables in queries that run on different nodes in a cluster would like cause
non-deterministic behavior because queries are not executed linearly.


### Changed return value of `TO_BOOL`

The AQL function `TO_BOOL` now always returns *true* if its argument is an array or an object.
In previous versions of ArangoDB, the function returned *false* for empty arrays or for
objects without attributes.


### Changed return value of `TO_NUMBER`

The AQL function `TO_NUMBER` now returns *null* if its argument is an object or an
array with more than one member. In previous version of ArangoDB, the return
value in these cases was 0. `TO_NUMBER` will return 0 for empty array, and the numeric
equivalent of the array member's value for arrays with a single member.


### New AQL keywords

The following keywords have been added to AQL in ArangoDB 2.3:

- `NOT`
- `AND`
- `OR`

Unquoted usage of these keywords for attribute names in AQL queries will likely
fail in ArangoDB 2.3. If any such attribute name needs to be used in a query, it
should be enclosed in backticks to indicate the usage of a literal attribute
name. 


## Removed features

### Bitarray indexes
  
Bitarray indexes were only half-way documented and integrated in previous versions 
of ArangoDB so their benefit was limited. The support for bitarray indexes has
thus been removed in ArangoDB 2.3. It is not possible to create indexes of type
"bitarray" with ArangoDB 2.3.

When a collection is opened that contains a bitarray index definition created 
with a previous version of ArangoDB, ArangoDB will ignore it and log the following
warning:

    index type 'bitarray' is not supported in this version of ArangoDB and is ignored 

Future versions of ArangoDB may automatically remove such index definitions so the
warnings will eventually disappear.


### Other removed features

The HTTP REST API method at `POST /_admin/modules/flush` has been removed. 


## Known issues

In ArangoDB 2.3.0, AQL queries containing filter conditions with an IN expression 
will not yet use an index:

    FOR doc IN collection FILTER doc.indexedAttribute IN [ ... ] RETURN doc
  
    FOR doc IN collection
      FILTER doc.indexedAttribute IN [ ... ]
      RETURN doc

We’re currently working on getting the IN optimizations done, and will ship them in 
a 2.3 maintenance release soon (e.g. 2.3.1 or 2.3.2).
