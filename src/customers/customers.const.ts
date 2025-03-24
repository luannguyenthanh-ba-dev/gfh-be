import { registerEnumType } from "@nestjs/graphql";

export enum CustomerGenders {
  MALE = "male",
  FEMALE = "female",
  UNKNOWN = "unknown",
}

// ✅ Register the enum with GraphQL
registerEnumType(CustomerGenders, {
  name: 'CustomerGenders', // Name to be used in GraphQL Schema
});
