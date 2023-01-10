---
fileID: appendix-java-script-modules-analyzers
title: Analyzer Management
weight: 11895
description: 
layout: default
---
The JavaScript API can be accessed via the `@arangodb/analyzers` module from
both server-side and client-side code (arangosh, Foxx):

{{< tabs >}}
{{% tab name="js" %}}
```js
var analyzers = require("@arangodb/analyzers");
```
{{% /tab %}}
{{< /tabs >}}

See [Analyzers](../../analyzers/) for general information and
details about the attributes.

## Analyzer Module Methods

### Create an Analyzer

{{< tabs >}}
{{% tab name="js" %}}
```js
var analyzer = analyzers.save(<name>, <type>[, <properties>[, <features>]])
```
{{% /tab %}}
{{< /tabs >}}

Create a new Analyzer with custom configuration in the current database.

- **name** (string): name for identifying the Analyzer later
- **type** (string): the kind of Analyzer to create
- **properties** (object, _optional_): settings specific to the chosen *type*.
  Most types require at least one property, so this may not be optional
- **features** (array, _optional_): array of strings with names of the features
  to enable
- returns **analyzer** (object): Analyzer object, also if an Analyzer with the
  same settings exists already. An error is raised if the settings mismatch
  or if they are invalid


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerCreate
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.save("csv", "delimiter", { "delimiter": "," }, ["frequency", "norm", "position"]);
~analyzers.remove("csv");
```
{{% /tab %}}
{{< /tabs >}}
 



### Get an Analyzer

{{< tabs >}}
{{% tab name="js" %}}
```js
var analyzer = analyzers.analyzer(<name>)
```
{{% /tab %}}
{{< /tabs >}}

Get an Analyzer by the name, stored in the current database. The name can be
prefixed with `_system::` to access Analyzers stored in the `_system` database.

- **name** (string): name of the Analyzer to find
- returns **analyzer** (object\|null): Analyzer object if found, else `null`


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerByName
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en");
```
{{% /tab %}}
{{< /tabs >}}
 



### List all Analyzers

{{< tabs >}}
{{% tab name="js" %}}
```js
var analyzerArray = analyzers.toArray()
```
{{% /tab %}}
{{< /tabs >}}

List all Analyzers available in the current database.

- returns **analyzerArray** (array): array of Analyzer objects


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerList
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.toArray();
```
{{% /tab %}}
{{< /tabs >}}
 



### Remove an Analyzer

{{< tabs >}}
{{% tab name="js" %}}
```js
analyzers.remove(<name> [, <force>])
```
{{% /tab %}}
{{< /tabs >}}

Delete an Analyzer from the current database.

- **name** (string): name of the Analyzer to remove
- **force** (bool, _optional_): remove Analyzer even if in use by a View.
  Default: `false`
- returns nothing: no return value on success, otherwise an error is raised


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerRemove
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
~analyzers.save("csv", "delimiter", { "delimiter": "," }, []);
analyzers.remove("csv");
```
{{% /tab %}}
{{< /tabs >}}
 



## Analyzer Object Methods

Individual Analyzer objects expose getter accessors for the aforementioned
definition attributes (see [Create an Analyzer](#create-an-analyzer)).

### Get Analyzer Name

{{< tabs >}}
{{% tab name="js" %}}
```js
var name = analyzer.name()
```
{{% /tab %}}
{{< /tabs >}}

- returns **name** (string): name of the Analyzer


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerName
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").name();
```
{{% /tab %}}
{{< /tabs >}}
 



### Get Analyzer Type

{{< tabs >}}
{{% tab name="js" %}}
```js
var type = analyzer.type()
```
{{% /tab %}}
{{< /tabs >}}

- returns **type** (string): type of the Analyzer


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerType
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").type();
```
{{% /tab %}}
{{< /tabs >}}
 



### Get Analyzer Properties

{{< tabs >}}
{{% tab name="js" %}}
```js
var properties = analyzer.properties()
```
{{% /tab %}}
{{< /tabs >}}

- returns **properties** (object): *type* dependent properties of the Analyzer


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerProperties
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").properties();
```
{{% /tab %}}
{{< /tabs >}}
 



### Get Analyzer Features

{{< tabs >}}
{{% tab name="js" %}}
```js
var features = analyzer.features()
```
{{% /tab %}}
{{< /tabs >}}

- returns **features** (array): array of strings with the features of the Analyzer


 {{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerFeatures
description: ''
render: input/output
version: '3.11'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").features();
```
{{% /tab %}}
{{< /tabs >}}
 


