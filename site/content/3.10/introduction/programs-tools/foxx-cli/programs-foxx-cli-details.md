---
fileID: programs-foxx-cli-details
title: 
weight: 415
description: 
layout: default
---
## Install

**foxx-cli** runs on [Node.js](https://nodejs.org) and can be installed with
[yarn](https://yarnpkg.com):

{{< tabs >}}
{{% tab name="sh" %}}
```sh
yarn global add foxx-cli
```
{{% /tab %}}
{{< /tabs >}}

Or with [npm](https://www.npmjs.com):

{{< tabs >}}
{{% tab name="sh" %}}
```sh
npm install --global foxx-cli
```
{{% /tab %}}
{{< /tabs >}}

**Note**: using yarn you can also run **foxx-cli** from your project's
`devDependencies`:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
yarn add --dev foxx-cli
yarn foxx help
```
{{% /tab %}}
{{< /tabs >}}

If you're using a recent version of npm you can also use npx:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
npx -p foxx-cli foxx help
```
{{% /tab %}}
{{< /tabs >}}

## Usage

After you've installed **foxx-cli**, you should be able to use the `foxx`
program. You can learn more about the different commands `foxx` supports by
using the `--help` flag.

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx --help
```
{{% /tab %}}
{{< /tabs >}}

You can also use the `--help` flag with commands to learn more about them, e.g.:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx install --help # Help for the "install" command

foxx server --help # Help for the "server" command

foxx server list --help # Subcommands are supported, too
```
{{% /tab %}}
{{< /tabs >}}

If you have no prior knowledge of Foxx, you can get started by
[installing ArangoDB locally](https://www.arangodb.com/download)
and then creating a new Foxx service in the current directory using the `init` command:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx init -i # answer the interactive questions
```
{{% /tab %}}
{{< /tabs >}}

If you want an example, you can also let `init` create an example service for you:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx init -e # create an example service please
```
{{% /tab %}}
{{< /tabs >}}

You can also just use `foxx init` to create a minimal service without the example code.

You can inspect the files created by the program and tweak them as necessary.
Once you're ready, install the service at a _mount path_ using the `install` command:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx install /hello-foxx # installs the current directory
```
{{% /tab %}}
{{< /tabs >}}

You should then be able to view the installed service in your browser at the following URL:

<http://localhost:8529/_db/_system/hello-foxx>

If you continue to work on your Foxx service and want to upgrade the installed
version with your local changes use the `upgrade` command to do so.

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx upgrade /hello-foxx # upgrades the server with the current directory
```
{{% /tab %}}
{{< /tabs >}}

## Special files

### manifest.json

The `manifest.json` or manifest file contains a service's meta-information.
See the [Foxx reference documentation](../../foxx-microservices/reference/foxx-reference-manifest).

The directory containing a service's `manifest.json` file is called the _root
directory_ of the service.

### foxxignore

If you want to exclude files from the service bundle that will uploaded to
ArangoDB you can create a file called `.foxxignore` in the root directory of
your service. Each line should specify one pattern you wish to ignore:

* Patterns starting with `!` will be treated as an explicit whitelist. Paths
  matching these patterns will not be ignored even if they would match any of
  the other patterns.

  **Example**: `!index.js` will override any pattern matching a file called
  `index.js`.

* Patterns starting with `/` will only match paths relative to the service's
  root directory.

  **Example**: `/package.json` will not match `node_modules/joi/package.json`.

* Patterns ending with `/` will match a directory and any files inside of it.

  **Example**: `node_modules/` will exclude all `node_modules` directories and
  all of their contents.

* A single `*` (glob) will match zero or more characters (even dots) in a file
  or directory name.

  **Example**: `.*` will match any files and directories with a name starting
  with a dot.

* A double `**` (globstar) will match zero or more levels of nesting.

  **Example**: `hello/**/world` will match `hello/world`, `hello/foo/world`,
  `hello/foo/bar/world`, and so on.

* Patterns starting with `#` are considered comments and will be ignored.

For more details on the pattern matching behavior, see the documentation of the
[minimatch](https://www.npmjs.com/package/minimatch) module (with the `dot` flag
enabled).

If no `.foxxignore` file is present in the service's root directory the
following patterns will be ignored automatically: `.git/`, `.svn/`, `.hg/`,
`*.swp`, `.DS_Store`.

Should you need to include files that match these patterns for some reason, you
can override this list by creating an empty `.foxxignore` file.

You can also create a `.foxxignore` file in the current directory using the
`ignore` command:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx ignore # creates a file pre-populated with the defaults

foxx ignore --force # creates an empty file
```
{{% /tab %}}
{{< /tabs >}}

To add individual patterns to the `.foxxignore` file just pass them as
additional arguments:

{{< tabs >}}
{{% tab name="sh" %}}
```sh
foxx ignore .git/ .svn/ # you can pass multiple patterns at once

foxx ignore '*.swp' # make sure to escape special characters
```
{{% /tab %}}
{{< /tabs >}}

### foxxrc

If you define servers using the `server` commands, a `.foxxrc` file will be
created in your `$HOME` directory, which is typically one of the following
paths:

* `/home/$USER` on Linux

* `/Users/$USER` on macOS

* `C:\Users\$USER` on Windows

This file contains sections for each server which may contain server credentials
should you decide to save them.
