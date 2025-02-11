---
fileID: appendix-references-cursor-object
title: Sequential Access and Cursors
weight: 11875
description: 
layout: default
---
If a query returns a cursor (for example by calling `db._query(...)`), then you can use *hasNext* and *next* to
iterate over the result set or *toArray* to convert it to an array.

If the number of query results is expected to be big, it is possible to 
limit the amount of documents transferred between the server and the client
to a specific value. This value is called *batchSize*. The *batchSize*
can optionally be set when a query is executed using its *execute* method. If no
*batchSize* value is specified, the server will pick a reasonable default value.
If the server has more documents than should be returned in a single batch,
the server will set the *hasMore* attribute in the result. It will also
return the id of the server-side cursor in the *id* attribute in the result.
This id can be used with the cursor API to fetch any outstanding results from
the server and dispose the server-side cursor afterwards.

## Has Next

checks if the cursor is exhausted
`cursor.hasNext()`

The *hasNext* operator returns *true*, then the cursor still has
documents. In this case the next document can be accessed using the
*next* operator, which will advance the cursor.

**Examples**


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: cursorHasNext
description: ''
render: input/output
version: '3.11'
release: stable
---
~ db._create("five");
~ db.five.save({ name : "one" });
~ db.five.save({ name : "two" });
~ db.five.save({ name : "three" });
~ db.five.save({ name : "four" });
~ db.five.save({ name : "five" });
  var a = db._query("FOR x IN five RETURN x");
  while (a.hasNext()) print(a.next());
~ db._drop("five")
```
{{% /tab %}}
{{< /tabs >}}
 



## Next

returns the next result document
`cursor.next()`

If the *hasNext* operator returns *true*, then the underlying
cursor of the AQL query still has documents. In this case the
next document can be accessed using the *next* operator, which
will advance the underlying cursor. If you use *next* on an
exhausted cursor, then *undefined* is returned.

**Examples**


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: cursorNext
description: ''
render: input/output
version: '3.11'
release: stable
---
~ db._create("five");
~ db.five.save({ name : "one" });
~ db.five.save({ name : "two" });
~ db.five.save({ name : "three" });
~ db.five.save({ name : "four" });
~ db.five.save({ name : "five" });
  db._query("FOR x IN five RETURN x").next();
~ db._drop("five")
```
{{% /tab %}}
{{< /tabs >}}
 



## Execute Query

executes a query
`query.execute(batchSize)`

Executes an AQL query. If the optional batchSize value is specified,
the server will return at most batchSize values in one roundtrip.
The batchSize cannot be adjusted after the query is first executed.

**Note**: There is no need to explicitly call the execute method if another
means of fetching the query results is chosen. The following two approaches
lead to the same result:


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: executeQueryNoBatchSize
description: ''
render: input/output
version: '3.11'
release: stable
---
~ db._create("users");
~ db.users.save({ name: "Gerhard" });
~ db.users.save({ name: "Helmut" });
~ db.users.save({ name: "Angela" });
  var result = db.users.all().toArray();
  print(result);
  var q = db._query("FOR x IN users RETURN x");
  result = [ ];
  while (q.hasNext()) {
    result.push(q.next());
  }
  print(result);
~ db._drop("users")
```
{{% /tab %}}
{{< /tabs >}}
 



The following two alternatives both use a batch size and return the same
result:


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: executeQueryBatchSize
description: ''
render: input/output
version: '3.11'
release: stable
---
~ db._create("users");
~ db.users.save({ name: "Gerhard" });
~ db.users.save({ name: "Helmut" });
~ db.users.save({ name: "Angela" });
  var result = [ ];
  var q = db.users.all();
  q.execute(1);
  while(q.hasNext()) {
    result.push(q.next());
  }
  print(result);
  result = [ ];
  q = db._query("FOR x IN users RETURN x", {}, { batchSize: 1 });
  while (q.hasNext()) {
    result.push(q.next());
  }
  print(result);
~ db._drop("users")
```
{{% /tab %}}
{{< /tabs >}}
 



## Dispose

disposes the result
`cursor.dispose()`

If you are no longer interested in any further results, you should call
*dispose* in order to free any resources associated with the cursor.
After calling *dispose* you can no longer access the cursor.

## Count

counts the number of documents
`cursor.count()`

The *count* operator counts the number of document in the result set and
returns that number. The *count* operator ignores any limits and returns
the total number of documents found.

`cursor.count(true)`

If the result set was limited by the *limit* operator or documents were
skipped using the *skip* operator, the *count* operator with argument
*true* will use the number of elements in the final result set - after
applying *limit* and *skip*.
