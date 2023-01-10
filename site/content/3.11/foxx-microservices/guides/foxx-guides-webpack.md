---
fileID: foxx-guides-webpack
title: Using Webpack with Foxx
weight: 1075
description: 
layout: default
---
You can use [Webpack](https://webpack.js.org/) to compile your Foxx services
the same way you would compile any other JavaScript code.
However there are a few things you will need to keep in mind.

## Basic configuration

Because the ArangoDB JavaScript environment is largely compatible with Node.js,
the starting point looks fairly similar:

{{< tabs >}}
{{% tab name="js" %}}
```js
"use strict";
module.exports = {
  mode: "production",
  target: "node",
  output: {
    libraryTarget: "commonjs2"
  },
  externals: [/^@arangodb(\/|$)/]
};
```
{{% /tab %}}
{{< /tabs >}}

## The service context

Foxx extends the `module` object with a special `context` property that
reflects the current [service context](../reference/foxx-reference-context).
As Webpack compiles multiple modules into a single file your code will
not be able to access the real `module` object provided by ArangoDB.

To work around this limitation you can use the `context` provided by the
[`@arangodb/locals` module](../reference/related-modules/#the-arangodblocals-module):

{{< tabs >}}
{{% tab name="js" %}}
```js
const { context } = require("@arangodb/locals");
```
{{% /tab %}}
{{< /tabs >}}

This object is identical to `module.context` and can be used as
a drop-in replacement:

{{< tabs >}}
{{% tab name="js" %}}
```js
const { context } = require("@arangodb/locals");
const createRouter = require("@arangodb/foxx/router");

const router = createRouter();
context.use(router);
```
{{% /tab %}}
{{< /tabs >}}

## Externals

By default Webpack will attempt to include any dependency your code imports.
This makes it easy to use third-party modules without worrying about
[filtering `devDependencies`](foxx-guides-bundled-node-modules)
but causes problems when importing modules provided by ArangoDB.

Most modules that are specific to ArangoDB or Foxx reside in the `@arangodb`
namespace. This makes it fairly straightforward to tell Webpack to ignore
them using the `externals` option:

{{< tabs >}}
{{% tab name="js" %}}
```js
module.exports = {
  // ...
  externals: [/^@arangodb(\/|$)/]
};
```
{{% /tab %}}
{{< /tabs >}}

You can also use this to exclude other modules provided by ArangoDB,
like the `joi` validation library:

{{< tabs >}}
{{% tab name="js" %}}
```js
module.exports = {
  // ...
  externals: [/^@arangodb(\/|$)/, "joi"]
};
```
{{% /tab %}}
{{< /tabs >}}

## Compiling scripts

As far as Webpack is concerned, scripts are additional entry points:

{{< tabs >}}
{{% tab name="js" %}}
```js
const path = require("path");
module.exports = {
  // ...
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./index.js",
    setup: "./scripts/setup.js"
  }
};
```
{{% /tab %}}
{{< /tabs >}}

**Note**: If your scripts are sharing a lot of code with each other or
the rest of the service this can result in some overhead as the shared code
will be included in each output file. A possible solution would be to
extract the shared code into a separate bundle.
