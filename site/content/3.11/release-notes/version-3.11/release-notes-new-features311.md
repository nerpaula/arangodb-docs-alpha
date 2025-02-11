---
fileID: release-notes-new-features311
title: Features and Improvements in ArangoDB 3.11
weight: 11495
description: 
layout: default
---
### Added AQL functions

Added the `DATE_ISOWEEKYEAR()` function that returns the ISO week number,
like `DATE_ISOWEEK()` does, but also the year it belongs to:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN DATE_ISOWEEKYEAR("2023-01-01") // { "week": 52, "year": 2022 }
```
{{% /tab %}}
{{< /tabs >}}

See [AQL Date functions](../../aql/functions/functions-date#date_isoweekyear) for details.

### Index cache refilling

The [edge cache refilling](../version-3.10/release-notes-new-features310#edge-cache-refilling-experimental)
feature introduced in v3.9.6 and v3.10.2 is no longer experimental. From v3.11.0
onward, it is called _**index** cache refilling_ and not limited to edge caches
anymore, but also supports in-memory hash caches of persistent indexes
(persistent indexes with the `cacheEnabled` option set to `true`).

## Server options

### Verify `.sst` files

The new `--rocksdb.verify-sst` startup option lets you validate the `.sst` files
currently contained in the database directory on startup. If set to `true`,
on startup, all SST files in the `engine-rocksdb` folder in the database
directory are validated, then the process finishes execution.
The default value is `false`.

### Support for terabyte and tebibyte suffixes

Numeric startup options support suffixes like `m` (megabytes) and `GiB` (gibibytes)
to make it easier to specify values that are expected in bytes. The following
suffixes are now also supported:

- `tib`, `TiB`, `TIB`: tebibytes (factor 1024<sup>4</sup>)
- `t`, `tb`, `T`, `TB`: terabytes (factor 1000<sup>4</sup>)

Example: `arangod --rocksdb.total-write-buffer-size 2TiB`

See [Suffixes for numeric options](../../administration/administration-configuration#suffixes-for-numeric-options)
for details.
