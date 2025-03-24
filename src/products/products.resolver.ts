import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Products } from "./models/products.model";
import { CreateProductArgs, PaginateProductsArgs } from "./dtos";
import { ProductsService } from "./products.service";
import { PaginatedProducts } from "./models/paginated-products.model";

@Resolver((of) => Products)
export class ProductsResolver {
  // ✅ Resolver implementation
  constructor(private readonly productsService: ProductsService) {}

  @Mutation((returns) => Products)
  async createProduct(@Args("createProductArgs") data: CreateProductArgs) {
    const product = await this.productsService.create(data);
    return product;
  }

  @Query((returns) => PaginatedProducts, { name: "paginateProducts" })
  async paginateProducts(@Args() filters: PaginateProductsArgs) {
    const result = await this.productsService.paginate(
      filters,
      filters.page,
      filters.limit,
      filters.order_by,
      filters.order
    );
    return result;
  }

}
