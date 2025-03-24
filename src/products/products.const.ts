import { registerEnumType } from "@nestjs/graphql";

export enum ProductCurrencies {
  "USD" = "USD",
  "EUR" = "EUR",
  "VND" = "VND",
  "CNY" = "CNY",
  "JPY" = "JPY",
  "KRW" = "KRW",
}

// ✅ Register the enum with GraphQL
registerEnumType(ProductCurrencies, {
  name: "ProductsCurrency", // Name to be used in GraphQL Schema
});
