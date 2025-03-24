import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersEntity } from "src/customers/entities/customers.entity";
import { ProductsEntity } from "src/products/entities/products.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        console.log("Connected DB:", process.env.POSTGRESQL_DATABASE);
        return {
          type: "postgres",
          host: process.env.POSTGRESQL_HOST || "localhost",
          port: parseInt(process.env.POSTGRESQL_PORT) ?? 5432,
          username: process.env.POSTGRESQL_USER || "admin",
          password: process.env.POSTGRESQL_PASSWORD || "admin1234",
          database: process.env.POSTGRESQL_DATABASE || "local_db",
          autoLoadEntities: true, // Automatically load entities
          synchronize: process.env.environment === "development", // Auto-migrate schema in development (disable in production)
          entities: [CustomersEntity, ProductsEntity],
          // logging: true,
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
