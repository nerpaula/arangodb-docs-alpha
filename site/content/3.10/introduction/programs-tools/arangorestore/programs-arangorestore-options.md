---
fileID: programs-arangorestore-options
title: _arangorestore_ Options
weight: 315
description: 
layout: default
---
Usage: `arangorestore [<options>]`

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangorestore" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangorestore" %}
