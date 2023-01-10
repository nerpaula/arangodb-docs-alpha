---
fileID: programs-arangobackup-options
title: Arangobackup Options
weight: 330
description: 
layout: default
---
Usage: `arangobackup <operation> [<options>]`

The `--operation` option can be passed as positional argument to specify the
desired action.

{% assign optionsFile = page.version.version | remove: "." | append: "-program-options-arangobackup" -%}
{% assign options = site.data[optionsFile] -%}
{% include program-option.html options=options name="arangobackup" %}
