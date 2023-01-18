---
fileID: administration-managing-users-in-arangosh
title: Managing Users in the ArangoDB Shell
weight: 1385
description: 
layout: default
---
`users.all()`

Fetches all existing ArangoDB users from the database.

*Examples*


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: USER_06_AllUsers
description: ''
render: input/output
version: '3.10'
release: stable
---
require("@arangodb/users").all();
```
{{% /tab %}}
{{< /tabs >}}
 



## Reload

`users.reload()`

Reloads the user authentication data on the server

All user authentication data is loaded by the server once on startup only and is
cached after that. When users get added or deleted, a cache flush is done
automatically, and this can be performed by a call to this method.

*Examples*


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: USER_03_reloadUser
description: ''
render: input/output
version: '3.10'
release: stable
---
require("@arangodb/users").reload();
```
{{% /tab %}}
{{< /tabs >}}
 



## Permission

`users.permission(user, database[, collection])`

Fetches the access level to the database or a collection.

The user and database name must be specified, optionally you can specify
the collection name.

This method will fail if the user cannot be found in the database.

*Examples*


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: USER_05_permission
description: ''
render: input/output
version: '3.10'
release: stable
---
~ require("@arangodb/users").grantDatabase("my-user", "testdb");
require("@arangodb/users").permission("my-user", "testdb");
```
{{% /tab %}}
{{< /tabs >}}
 


