---
fileID: spring-data-reference-mapping-edge
title: Edge
weight: 4025
description: 
layout: default
---
## Annotation @Edge

The annotations `@Edge` applied to a class marks this class as a candidate for mapping to the database. The most relevant parameter is `value` to specify the collection name in the database. The annotation `@Edge` specifies the collection type to `EDGE`.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Edge("relations")
public class Relation {
  ...
}
```
{{% /tab %}}
{{< /tabs >}}

## Spring Expression support

Spring Data ArangoDB supports the use of SpEL expressions within `@Edge#value`. This feature lets you define a dynamic collection name which can be used to implement multi tenancy applications.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Component
public class TenantProvider {

	public String getId() {
		// threadlocal lookup
	}

}
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="java" %}}
```java
@Edge("#{tenantProvider.getId()}_relations")
public class Relation {
  ...
}
```
{{% /tab %}}
{{< /tabs >}}

## Annotation @From and @To

With the annotations `@From` and `@To` applied on a field in a class annotated with `@Edge` the nested object is fetched from the database. The nested object has to be stored as a separate document in the collection described in the `@Document` annotation of the nested object class. The _\_id_ field of this nested object is stored in the fields `_from` or `_to` within the edge document.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Edge("relations")
public class Relation {
  @From
  private Person c1;
  @To
  private Person c2;
}

@Document(value="persons")
public class Person {
  @Id
  private String id;
}
```
{{% /tab %}}
{{< /tabs >}}

The database representation of `Relation` in collection _relations_ looks as follow:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "123",
  "_id" : "relations/123",
  "_from" : "persons/456",
  "_to" : "persons/789"
}
```
{{% /tab %}}
{{< /tabs >}}

and the representation of `Person` in collection _persons_:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "456",
  "_id" : "persons/456",
}
{
  "_key" : "789",
  "_id" : "persons/789",
}
```
{{% /tab %}}
{{< /tabs >}}

**Note:** If you want to save an instance of `Relation`, both `Person` objects (from & to) already have to be persisted and the class `Person` needs a field with the annotation `@Id` so it can hold the persisted `_id` from the database.
