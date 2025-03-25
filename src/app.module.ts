import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { DirectiveLocation, GraphQLDirective } from "graphql";
import { upperDirectiveTransformer } from "./common/directives/upper-case.directive";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { DatabaseModule } from "./database/database.module";
import { CustomersModule } from "./customers/customers.module";
import { DateScalar } from "./common/scalars/date.scalar";
import { ProductsModule } from "./products/products.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { BmiModule } from "./health-index/bmi/bmi.module";

@Module({
  imports: [
    DatabaseModule,
    CustomersModule,
    ProductsModule,
    AuthModule,
    BmiModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      introspection: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      driver: ApolloDriver,
      subscriptions: {
        "graphql-ws": true,
      },
      autoSchemaFile: "schema.gql",
      transformSchema: (schema) => upperDirectiveTransformer(schema, "upper"),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
  controllers: [AppController],
  providers: [DateScalar],
})
export class AppModule {}
