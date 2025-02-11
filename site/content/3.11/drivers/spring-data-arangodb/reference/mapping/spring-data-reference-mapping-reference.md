---
fileID: spring-data-reference-mapping-reference
title: Reference
weight: 4055
description: 
layout: default
---
With the annotation `@Ref` applied on a field the nested object isn’t stored as a nested object in the document. The `_id` field of the nested object is stored in the document and the nested object has to be stored as a separate document in another collection described in the `@Document` annotation of the nested object class. To successfully persist an instance of your object the referencing field has to be null or it's instance has to provide a field with the annotation `@Id` including a valid id.

**Examples**

{{< tabs >}}
{{% tab name="java" %}}
```java
@Document(value="persons")
public class Person {
  @Ref
  private Address address;
}

@Document("addresses")
public class Address {
  @Id
  private String id;
  private String country;
  private String street;
}
```
{{% /tab %}}
{{< /tabs >}}

The database representation of `Person` in collection _persons_ looks as follow:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "123",
  "_id" : "persons/123",
  "address" : "addresses/456"
}
```
{{% /tab %}}
{{< /tabs >}}

and the representation of `Address` in collection _addresses_:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "456",
  "_id" : "addresses/456",
  "country" : "...",
  "street" : "..."
}
```
{{% /tab %}}
{{< /tabs >}}

Without the annotation `@Ref` at the field `address`, the stored document would look:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "123",
  "_id" : "persons/123",
  "address" : {
    "country" : "...",
     "street" : "..."
  }
}
```
{{% /tab %}}
{{< /tabs >}}
