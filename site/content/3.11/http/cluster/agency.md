---
fileID: agency
title: HTTP Interface for Agency feature
weight: 2295
description: 
layout: default
---
The Agency is the ArangoDB component which manages the entire ArangoDB cluster. 
ArangoDB itself mainly uses the Agency as a central place to store the configuration
and the cluster nodes health management. It implements the Raft consensus protocol to act as
the single-source of truth for the entire cluster. You may know other software providing similar functionality e.g. _Apache Zookeeper_, _etcd_ or _Consul_.

To an end-user the Agency is essentially a fault-tolerant Key-Value Store with a simple REST-API. 
It is possible to use the Agency API for a variety of use-cases, for example:

- Centralized configuration repository
- Service discovery registry
- Distributed synchronization service
- Distributed Lock-Manager

*Note 1*: To access the Agency API with authentication enabled, you need to include an authorization header
with every request. The authorization header _must_ contain a *superuser JWT Token*; For more information see the [authentication section](../general#authentication).

*Note 2*: The key-prefix `/arango` contains ArangoDBs internal configuration. You should _never_ change any values below the _arango_ key.

### Key-Value store APIs

Generally, all document IO to and from the key-value store consists of JSON arrays. The outer array is an envelope for multiple read or write transactions. The results are arrays are an envelope around the results corresponding to the order of the incoming transactions.

Consider the following write operation into a pristine Agency:


{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/write -d '[[{"a":{"op":"set","new":{"b":{"c":[1,2,3]},"e":12}},"d":{"op":"set","new":false}}]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[{"results":[1]}]
```
{{% /tab %}}
{{< /tabs >}}

And the subsequent read operation 

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/"]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "a": {
      "b": {
        "c": [1,2,3]
      },
      "e": 12
    },
    "d": false
  }
]
```
{{% /tab %}}
{{< /tabs >}}

In the first step we committed a single transaction that commits the JSON document inside the inner transaction array to the Agency. The result is `[1]`, which is the replicated log index. Repeated invocation will yield growing log numbers 2, 3, 4, etc. 

The read access is a complete access to the key-value store indicated by access to its root element and returns the result as an array corresponding to the outermost array in the read transaction.

Let's dig in some deeper.

### Read API

Let's start with the above initialized key-value store in the following. Let us visit the following read operations:

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/a/b"]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "a": {
      "b": {
        "c": [1,2,3]
      }
    }
  }
]
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

And

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/a/b/c"]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "a": {
      "b": {
        "c": [1,2,3]
      }
    }
  }
]
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

Note that the above results are identical, meaning that results obtained from the Agency are always return with full path.

The second outer array brackets in read operations correspond to transactions, meaning that the result is guaranteed to have been acquired without a write transaction in between:

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/a/e"],["/d","/a/b"]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "a": {
      "e": 12
    }
  },
  {
    "a": {
      "b": {
        "c": [1,2,3
        ]
      }
    },
    "d": false
  }
]
```
{{% /tab %}}
{{< /tabs >}}

While the first transaction consists of a single read access to the key-value-store thus stretching the meaning of the word transaction, the second bracket actually hold two disjunct read accesses, which have been joined within zero-time, i.e. without a write access in between. That is to say that `"/d"` cannot have changed before `"/a/b"` had been acquired.

Let's try to fetch a value from the key-value-store, which does not exist:

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/a/b/d"]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "a": {
      "b": {}
    }
  }
]
```
{{% /tab %}}
{{< /tabs >}}

The result returns the cross section of the requested path and the key-value-store contents. `"/a/b"` exists, but there is no key `"/a/b/d"`. Thus the following transaction will yield:

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/a/b/d","/d"]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "a": {
      "b": {}
    },
    "d": false
  }
]
```
{{% /tab %}}
{{< /tabs >}}

And this last read operation should return:

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/read -d '[["/a/b/c"],["/a/b/d"],["/a/x/y"],["/y"],["/a/b","/a/x" ]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {"a":{"b":{"c":[1,2,3]}}},
  {"a":{"b":{}}},
  {"a":{}},
  {},
  {"a":{"b":{"c":[1,2,3]}}}
]

```
{{% /tab %}}
{{< /tabs >}}

### Write API

The write API must obviously be more versatile and needs a more detailed appreciation. Write operations are arrays of transactions with preconditions, i.e. `[[U,P]]`, where the system tries to apply all updates in the outer array in turn, rejecting those whose precondition is not fulfilled by the current state. It is guaranteed that the transactions in the write request are sequenced adjacent to each other (with no intervention from other write requests). Only the ones with failed preconditions are left out.

For `P`, the value of a key is an object with attributes `"old"`, `"oldNot"`, `"oldEmpty"` or `"isArray"`. With `"old"` one can specify a JSON value that has to be present for the condition to be fulfilled. With `"oldNot"` one may check for a value to not be equal to the test. While with `"oldEmpty"`, which can take a boolean value, one can specify that the key value needs to be not set `true` or set to an arbitrary value `false`. With `"isArray"` one can specify that the value must be an array. As a shortcut, `"old"` values of scalar or array type may be stored directly in the attribute.
Examples:

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a/b/c": { "old": [1,2,3] }}
```
{{% /tab %}}
{{< /tabs >}}

is a precondition specifying that the previous value of the key `"/a/b/c"` key must be `[1,2,3]`. If and only if the value of the precondition is not an object we provide a notation, where the keyword `old` may be omitted. Thus, the above check may be shortcut as 

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a/b/c": [1, 2, 3] }
```
{{% /tab %}}
{{< /tabs >}}

Consider the Agency in initialized as above let's review the responses from the Agency as follows:

{{< tabs >}}
{{% tab name="" %}}
```
curl -L http://$SERVER:$PORT/_api/agency/write -d '[[{"/a/b/c":{"op":"set","new":[1,2,3,4]},"/a/b/pi":{"op":"set","new":"some text"}},{"/a/b/c":{"old":[1,2,3]}}]]'
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "results": [19]
}
```
{{% /tab %}}
{{< /tabs >}}

The condition is fulfilled in the first run and would be wrong in a second returning

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "results": [0]
}
```
{{% /tab %}}
{{< /tabs >}}

`0` as a result means that the precondition failed and no "real" log number was returned.

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a/e": { "oldEmpty": false } }
```
{{% /tab %}}
{{< /tabs >}}

means that the value of the key `"a/e"` must be set (to something, which can be `null`!). The condition

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a/e": { "oldEmpty": true } }
```
{{% /tab %}}
{{< /tabs >}}

means that the value of the key `"a/e"` must be unset. The condition

{{< tabs >}}
{{% tab name="" %}}
```
{ "/a/b/c": { "isArray": true } }
```
{{% /tab %}}
{{< /tabs >}}

means that the value of the key `"a/b/c"` must be an array.

The update value U is an object, the attribute names are again key strings and the values are objects with optional attributes `"new"`, `"op"` and `"ttl"`. They have the following meaning:

`"op"` determines the operation, possible values are `"set"` (the default, if left out), `"delete"`, `"increment"`, `"decrement"`, `"push"`, `"pop"`, `"shift"` or `"prepend"`

`"new"` is the new value, can be omitted for the `"delete"` operation and for `"increment"` and `"decrement"`, where `1` is implied

`"ttl"`, if present, the new value that is being set gets a time to live in seconds, given by a numeric value in this attribute. It is only guaranteed that the actual removal of the value is done according to the system clock, so up to clock skew between servers. The removal is done by an additional write transaction that is automatically generated between the regular writes.

Additional rule: If none of `"new"` and `"op"` is set or the value is not even an object, then this is to be interpreted as if it were

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "op": "set", "new": <VALUE> }
```
{{% /tab %}}
{{< /tabs >}}

which amounts to setting the value with no precondition.

Examples:

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a": { "op": "set", "new": 12 } }
```
{{% /tab %}}
{{< /tabs >}}

sets the value of the key `"/a"` to `12`. The same could have been achieved by

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a": 12 }
```
{{% /tab %}}
{{< /tabs >}}

or by

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a": { "new": 12} }
```
{{% /tab %}}
{{< /tabs >}}

The operation

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "/a/b": { "new": { "c": [1,2,3,4] } } }
```
{{% /tab %}}
{{< /tabs >}}

sets the key `"/a/b"` to `{"c": [1,2,3,4]}`. Note that in the above example this is the same as setting the value of `"/a/b/c"` to `[1,2,3,4]`. The difference is, that if `a/b` had other sub attributes, then this transaction would delete all these other attributes and make `"/a/b"` equal to `{"c": [1,2,3,4]}`, whereas setting `"/a/b/c"` to `[1,2,3,4]` would retain all attributes other than `"c"` in `"/a/b"`.

Here are some more examples for full transactions (update/precondition pairs). The transaction

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/a/b": { "new": { "c": [1,2,3,4] } } },
  { "/a/b": { "old": { "c": [1,2,3] } } } ]
```
{{% /tab %}}
{{< /tabs >}}

sets the key `"/a/b"` to `{"c":[1,2,3,4]}` if and only if it was `{"c":[1,2,3]}` before. Note that this fails if `"/a/b"` had other attributes than `"c"`. The transaction

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/x": { "op": "delete" } },
  { "/x": { "old": false } } ]
```
{{% /tab %}}
{{< /tabs >}}

clears the value of the key `"/x"` if this old value was false.

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/y": { "new": 13 },
  { "/y": { "oldEmpty": true } } }
]
```
{{% /tab %}}
{{< /tabs >}}

sets the value of `"/y"` to `13`, but only, if it was unset before.

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/z": { "op": "push", "new": "Max" } } ]
```
{{% /tab %}}
{{< /tabs >}}

appends the string `"Max"` to the end of the list stored in the `"z"` attribute, or creates an array `["Max"]` in `"z"` if it was unset or not an array.

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/u": { "op": "pop" } } ]
```
{{% /tab %}}
{{< /tabs >}}

removes the last entry of the array stored under `"u"`, if the value of `"u"` is not set or not an array.

### HTTP-headers for write operations

`X-ArangoDB-Agency-Mode` with possible values `"waitForCommitted"`, `"waitForSequenced"` and `"noWait"`.

In the first case the write operation only returns when the commit to the replicated log has actually happened. In the second case the write operation returns when the write transactions that fulfilled their preconditions have been sequenced and thus it is known, which of the write transactions in the given array had fulfilled preconditions. In both cases the body is a JSON array containing the indexes of the transactions in the list that had fulfilled preconditions.

In the last case, `"noWait"`, the operation returns immediately, an empty body is returned. To get any information about the result of the operation one has to specify a tag (see below) and ask about the status later on.

`X-ArangoDB-Agency-Tag` with an arbitrary UTF-8 string value.

### Observers

External services to the Agency may announce themselves or others to be observers of arbitrary existing or future keys in the key-value-store. The Agency must then inform the observing service of any changes to the subtree below the observed key. The notification is done by virtue of POST requests to a required valid URL.

In order to observe any future modification below say `"/a/b/c"`, a observer is announced through posting the below document to the Agency’s write REST handler:

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/a/b/c": 
    { "op":  "observe", 
      "url": "http://<host>:<port>/<path>" 
    }
  } ]
```
{{% /tab %}}
{{< /tabs >}}

The observer is notified of any changes to that target until such time that it removes itself as an observer of that key through

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/a/b/c": 
    { "op":  "unobserve", 
      "url": "http://<host>:<port>/<path>" } } ]
```
{{% /tab %}}
{{< /tabs >}}

Note that the last document removes all observations from entities below `"/a/b/c"`. In particular, issuing

{{< tabs >}}
{{% tab name="json" %}}
```json
[ { "/": "unobserve", "url": "http://<host>:<port>/<path>"} ] 
```
{{% /tab %}}
{{< /tabs >}}

will result in the removal of all observations for URL `"http://<host>:<port>/<path>"`.
The notifying POST requests are submitted immediately with any complete array of changes to the read db of the leader of create, modify and delete events accordingly; The body

{{< tabs >}}
{{% tab name="json" %}}
```json
{ "term": "5", 
  "index": 167,
  "/": { 
    "/a/b/c" : { "op": "modify", "old": 1, "new": 2 } },
    "/constants/euler" : {"op": "create", "new": 2.718281828459046 },
    "/constants/pi": { "op": "delete" } }
```
{{% /tab %}}
{{< /tabs >}}

### Configuration

At all times, i.e. regardless of the state of the Agents and the current health of the RAFT consensus, one can invoke the configuration API:

    curl http://$SERVER:$PORT/_api/agency/config

Here, and in all subsequent calls, we assume that `$SERVER` is
replaced by the server name and `$PORT` is replaced by the port
number. We use `curl` throughout for the examples, but any client
library performing HTTP requests should do.
The output might look somewhat like this

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "term": 1,
  "leaderId": "f5d11cde-8468-4fd2-8747-b4ef5c7dfa98",
  "lastCommitted": 1,
  "lastAcked": {
    "ac129027-b440-4c4f-84e9-75c042942171": 0.21,
    "c54dbb8a-723d-4c82-98de-8c841a14a112": 0.21,
    "f5d11cde-8468-4fd2-8747-b4ef5c7dfa98": 0
  },
  "configuration": {
    "pool": {
      "ac129027-b440-4c4f-84e9-75c042942171": "tcp://localhost:8531",
      "c54dbb8a-723d-4c82-98de-8c841a14a112": "tcp://localhost:8530",
      "f5d11cde-8468-4fd2-8747-b4ef5c7dfa98": "tcp://localhost:8529"
    },
    "active": [
      "ac129027-b440-4c4f-84e9-75c042942171",
      "c54dbb8a-723d-4c82-98de-8c841a14a112",
      "f5d11cde-8468-4fd2-8747-b4ef5c7dfa98"
    ],
    "id": "f5d11cde-8468-4fd2-8747-b4ef5c7dfa98",
    "agency size": 3,
    "pool size": 3,
    "endpoint": "tcp://localhost:8529",
    "min ping": 0.5,
    "max ping": 2.5,
    "supervision": false,
    "supervision frequency": 5,
    "compaction step size": 1000,
    "supervision grace period": 120
  }
}
```
{{% /tab %}}
{{< /tabs >}}

This is the actual output of a healthy Agency. The configuration of the Agency is found in the `configuration` section as you might have guessed. It is populated by static information on the startup parameters like `agency size`, the once generated `unique id` etc. It holds information on the invariants of the RAFT algorithm and data compaction.

The remaining data reflect the variant entities in RAFT, as `term` and `leaderId`, also some debug information on how long the last leadership vote was received from any particular Agency member. Low term numbers on a healthy network are an indication of good operation environment, while often increasing term numbers indicate, that the network environment and stability suggest to raise the RAFT parameters `min ping` and 'max ping' accordingly.
