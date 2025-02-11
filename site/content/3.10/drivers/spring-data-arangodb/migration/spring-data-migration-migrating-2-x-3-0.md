---
fileID: spring-data-migration-migrating-2-x-3-0
title: Migrating Spring Data ArangoDB 2.x to 3.0
weight: 4070
description: 
layout: default
---
## Annotations @Key

The annotation `@Key` is removed. Use `@Id` instead.

## Annotations @Id

The annotation `@Id` is now saved in the database as field `_key` instead of `_id`. All operations in `ArangoOperations` and `ArangoRepository` still work with `@Id` and also now supports non-String fields.

If you - for some reason - need the value of `_id` within your application, you can use the annotation `@ArangoId` on a `String` field instead of `@Id`.

**Note**: The field annotated with `@ArangoId` will not be persisted in the database. It only exists for reading purposes.

## ArangoRepository

`ArangoRepository` now requires a second generic type. This type `ID` represents the type of your domain object field annotated with `@Id`.

**Examples**

{{< tabs >}}
{{% tab name="java" %}}
```java
public class Customer {
  @Id private String id;
}

public interface CustomerRepository extends ArangoRepository<Customer, String> {

}
```
{{% /tab %}}
{{< /tabs >}}

## Annotation @Param

The annotation `com.arangodb.springframework.annotation.Param` is removed. Use `org.springframework.data.repository.query.Param` instead.

## DBEntity

`DBEntity` is removed. Use `VPackSlice` in your converter instead.

## DBCollectionEntity

`DBCollectionEntity` is removed. Use `VPackSlice` in your converter instead.
