---
fileID: fundamentals-bind-parameters
title: Bind parameters
weight: 3500
description: 
layout: default
---
AQL supports the usage of bind parameters, thus allowing to separate the query
text from literal values used in the query. It is good practice to separate the
query text from the literal values because this will prevent (malicious)
injection of keywords and other collection names into an existing query. This
injection would be dangerous because it may change the meaning of an existing
query.

Using bind parameters, the meaning of an existing query cannot be changed. Bind
parameters can be used everywhere in a query where literals can be used.

## Syntax

The general syntax for bind parameters is `@name` where `@` signifies that this
is a value bind parameter and *name* is the actual parameter name. It can be
used to substitute values in a query.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN @value
```
{{% /tab %}}
{{< /tabs >}}

For collections, there is a slightly different syntax `@@coll` where `@@`
signifies that it is a collection bind parameter and *coll* is the parameter
name.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN @@coll
  RETURN doc
```
{{% /tab %}}
{{< /tabs >}}

Keywords and other language constructs cannot be replaced by bind values, such
as `FOR`, `FILTER`, `IN`, `INBOUND` or function calls.

Bind parameter names must start with any of the letters *a* to *z* (upper or
lower case) or a digit (*0* to *9*), and can be followed by any letter, digit
or the underscore symbol.

They must not be quoted in the query code:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FILTER u.name == "@name" // wrong
FILTER u.name == @name   // correct
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN "@@collection" // wrong
FOR doc IN @@collection   // correct
```
{{% /tab %}}
{{< /tabs >}}

If you need to do string processing (concatenation, etc.) in the query, you
need to use [string functions](../functions/functions-string) to do so:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  FILTER u.id == CONCAT('prefix', @id, 'suffix') && u.name == @name
  RETURN u
```
{{% /tab %}}
{{< /tabs >}}

## Usage

### General

The bind parameter values need to be passed along with the query when it is
executed, but not as part of the query text itself. In the web interface,
there is a pane next to the query editor where the bind parameters can be
entered. For below query, two input fields will show up to enter values for
the parameters `id` and `name`.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  FILTER u.id == @id && u.name == @name
  RETURN u
```
{{% /tab %}}
{{< /tabs >}}

When using `db._query()` (in arangosh for instance), then an
object of key-value pairs can be passed for the parameters. Such an object
can also be passed to the HTTP API endpoint `_api/cursor`, as attribute
value for the key `bindVars`:

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "query": "FOR u IN users FILTER u.id == @id && u.name == @name RETURN u",
  "bindVars": {
    "id": 123,
    "name": "John Smith"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

Bind parameters that are declared in the query must also be passed a parameter
value, or the query will fail. Specifying parameters that are not declared in
the query will result in an error too.

Specific information about parameters binding can also be found in:

- [AQL with Web Interface](../how-to-invoke-aql/invocation-with-web-interface)
- [AQL with _arangosh_](../how-to-invoke-aql/invocation-with-arangosh)
- [HTTP Interface for AQL Queries](../../http/aql-query-cursors/)

### Nested attributes

Bind parameters can be used for both, the dot notation as well as the square
bracket notation for sub-attribute access. They can also be chained:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET doc = { foo: { bar: "baz" } }

RETURN doc.@attr.@subattr
// or
RETURN doc[@attr][@subattr]
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "attr": "foo",
  "subattr": "bar"
}
```
{{% /tab %}}
{{< /tabs >}}

Both variants in above example return `[ "baz" ]` as query result.

The whole attribute path, for highly nested data in particular, can also be
specified using the dot notation and a single bind parameter, by passing an
array of strings as parameter value. The elements of the array represent the
attribute keys of the path:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
LET doc = { a: { b: { c: 1 } } }
RETURN doc.@attr
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "attr": [ "a", "b", "c" ] }
```
{{% /tab %}}
{{< /tabs >}}

The example query returns `[ 1 ]` as result. Note that `{ "attr": "a.b.c" }`
would return the value of an attribute called `a.b.c`, not the value of
attribute `c` with the parents `a` and `b` as `[ "a", "b", "c" ]` would.

### Collection bind parameters

A special type of bind parameter exists for injecting collection names. This
type of bind parameter has a name prefixed with an additional `@` symbol, so
`@@name` in the query.

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN @@collection
  FILTER u.active == true
  RETURN u
```
{{% /tab %}}
{{< /tabs >}}

The second `@` will be part of the bind parameter name, which is important to
remember when specifying the `bindVars` (note the leading `@`):

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "query": "FOR u IN @@collection FILTER u.active == true RETURN u",
  "bindVars": {
    "@collection": "users"
  }
}
```
{{% /tab %}}
{{< /tabs >}}
