---
fileID: programs-arangodump-limitations
title: _arangodump_ Limitations
weight: 295
description: 
layout: default
---
_arangodump_ has the following limitations:

- In a cluster, _arangodump_ does not guarantee to dump a consistent snapshot
  if write operations happen while the dump is in progress (see
  [Hot Backups](../../backup-restore/#hot-backups) for an alternative). It is
  therefore recommended not to  perform any data-modification operations on the
  cluster while _arangodump_ is running. This is in contrast to what happens on
  a single instance or an active failover setup, where even if
  write operations are ongoing, the created dump is consistent, as a snapshot
  is taken when the dump starts.
