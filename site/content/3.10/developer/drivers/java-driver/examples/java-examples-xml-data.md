---
fileID: java-examples-xml-data
title: How to add XML data to ArangoDB?
weight: 3860
description: 
layout: default
---
## Problem

You want to store XML data files into a database to have the ability to make
queries onto them.

{{% hints/info %}}
This example was written for and tested with ArangoDB 3.1 and the corresponding
Java driver.
{{% /hints/info %}}


## Solution

Since version 3.1.0 the arangodb-java-driver supports writing, reading and
querying of raw strings containing the JSON documents.

With [JsonML](http://www.jsonml.org/) you can convert a XML
string into a JSON string and back to XML again.

Converting XML into JSON with JsonML example:

{{< tabs >}}
{{% tab name="java" %}}
```java
String string = "<recipe name=\"bread\" prep_time=\"5 mins\" cook_time=\"3 hours\"> "
        + "<title>Basic bread</title> "
        + "<ingredient amount=\"8\" unit=\"dL\">Flour</ingredient> "
        + "<ingredient amount=\"10\" unit=\"grams\">Yeast</ingredient> "
        + "<ingredient amount=\"4\" unit=\"dL\" state=\"warm\">Water</ingredient> "
        + "<ingredient amount=\"1\" unit=\"teaspoon\">Salt</ingredient> "
        + "<instructions> "
        + "<step>Mix all ingredients together.</step> "
        + "<step>Knead thoroughly.</step> "
        + "<step>Cover with a cloth, and leave for one hour in warm room.</step> "
        + "<step>Knead again.</step> "
        + "<step>Place in a bread baking tin.</step> "
        + "<step>Cover with a cloth, and leave for one hour in warm room.</step> "
        + "<step>Bake in the oven at 180(degrees)C for 30 minutes.</step> "
        + "</instructions> "
        + "</recipe> ";

JSONObject jsonObject = JSONML.toJSONObject(string);
System.out.println(jsonObject.toString());
```
{{% /tab %}}
{{< /tabs >}}

The converted JSON string:

{{< tabs >}}
{{% tab name="json" %}}
```json
{
   "prep_time" : "5 mins",
   "name" : "bread",
   "cook_time" : "3 hours",
   "tagName" : "recipe",
   "childNodes" : [
      {
         "childNodes" : [
            "Basic bread"
         ],
         "tagName" : "title"
      },
      {
         "childNodes" : [
            "Flour"
         ],
         "tagName" : "ingredient",
         "amount" : 8,
         "unit" : "dL"
      },
      {
         "unit" : "grams",
         "amount" : 10,
         "tagName" : "ingredient",
         "childNodes" : [
            "Yeast"
         ]
      },
      {
         "childNodes" : [
            "Water"
         ],
         "tagName" : "ingredient",
         "amount" : 4,
         "unit" : "dL",
         "state" : "warm"
      },
      {
         "childNodes" : [
            "Salt"
         ],
         "tagName" : "ingredient",
         "unit" : "teaspoon",
         "amount" : 1
      },
      {
         "childNodes" : [
            {
               "tagName" : "step",
               "childNodes" : [
                  "Mix all ingredients together."
               ]
            },
            {
               "tagName" : "step",
               "childNodes" : [
                  "Knead thoroughly."
               ]
            },
            {
               "childNodes" : [
                  "Cover with a cloth, and leave for one hour in warm room."
               ],
               "tagName" : "step"
            },
            {
               "tagName" : "step",
               "childNodes" : [
                  "Knead again."
               ]
            },
            {
               "childNodes" : [
                  "Place in a bread baking tin."
               ],
               "tagName" : "step"
            },
            {
               "tagName" : "step",
               "childNodes" : [
                  "Cover with a cloth, and leave for one hour in warm room."
               ]
            },
            {
               "tagName" : "step",
               "childNodes" : [
                  "Bake in the oven at 180(degrees)C for 30 minutes."
               ]
            }
         ],
         "tagName" : "instructions"
      }
   ]
}
```
{{% /tab %}}
{{< /tabs >}}

Saving the converted JSON to ArangoDB example:

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB.Builder arango = new ArangoDB.Builder().build();
ArangoCollection collection = arango.db().collection("testCollection")
DocumentCreateEntity<String> entity = collection.insertDocument(
                jsonObject.toString());
String key = entity.getKey();
```
{{% /tab %}}
{{< /tabs >}}

Reading the stored JSON as a string and convert it back to XML example:

{{< tabs >}}
{{% tab name="java" %}}
```java
String rawJsonString = collection.getDocument(key, String.class);
String xml = JSONML.toString(rawJsonString);
System.out.println(xml);
```
{{% /tab %}}
{{< /tabs >}}

Example output:

{{< tabs >}}
{{% tab name="xml" %}}
```xml
<recipe _id="RawDocument/6834407522" _key="6834407522" _rev="6834407522"
         cook_time="3 hours" name="bread" prep_time="5 mins">
  <title>Basic bread</title>
  <ingredient amount="8" unit="dL">Flour</ingredient>
  <ingredient amount="10" unit="grams">Yeast</ingredient>
  <ingredient amount="4" state="warm" unit="dL">Water</ingredient>
  <ingredient amount="1" unit="teaspoon">Salt</ingredient>
  <instructions>
    <step>Mix all ingredients together.</step>
    <step>Knead thoroughly.</step>
    <step>Cover with a cloth, and leave for one hour in warm room.</step>
    <step>Knead again.</step>
    <step>Place in a bread baking tin.</step>
    <step>Cover with a cloth, and leave for one hour in warm room.</step>
    <step>Bake in the oven at 180(degrees)C for 30 minutes.</step>
  </instructions>
</recipe>
```
{{% /tab %}}
{{< /tabs >}}

**Note:** The [fields mandatory to ArangoDB documents](../../../getting-started/data-model-concepts/documents/data-modeling-documents-document-address)
are added; If they break your XML schema you have to remove them.

Query raw data example:

{{< tabs >}}
{{% tab name="java" %}}
```java
String queryString = "FOR t IN testCollection FILTER t.cook_time == '3 hours' RETURN t";
ArangoCursor<String> cursor = arango.db().query(queryString, null, null, String.class);
while (cursor.hasNext()) {
    JSONObject jsonObject = new JSONObject(cursor.next());
    String xml = JSONML.toString(jsonObject);
    System.out.println("XML value: " + xml);
}
```
{{% /tab %}}
{{< /tabs >}}
