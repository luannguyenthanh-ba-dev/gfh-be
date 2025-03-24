import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Customers, PaginatedCustomers } from "./models/customers.model";
import { CustomersService } from "./customers.service";
import {
  AddCustomerArgs,
  PaginateCustomersArgs,
  UpdateCustomerArgs,
} from "./dtos";
import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";

@Resolver((of) => Customers)
export class CustomersResolver {
  private readonly logger = new Logger(CustomersResolver.name);
  constructor(private readonly customersService: CustomersService) {}

  @Mutation((returns) => Customers, { name: "addCustomer" })
  async addCustomer(
    @Args("addCustomerArgs") data: AddCustomerArgs
  ): Promise<Customers> {
    const exist_email = await this.customersService.findOne({
      email: data.email,
    });
    if (exist_email) {
      throw new BadRequestException("Customer email already exists");
    }
    const customer = await this.customersService.create(data);
    return customer;
  }

  /**
  @Query decorator options
  The @Query() decorator's options object (where we pass {name: 'author'} above) accepts a number of key/value pairs:

  - name: name of the query; a string
  - description: a description that will be used to generate GraphQL schema documentation (e.g., in GraphQL playground); a string
  - deprecationReason: sets query metadata to show the query as deprecated (e.g., in GraphQL playground); a string
  - nullable: whether the query can return a null data response; boolean or 'items' or 'itemsAndList' (see above for details of 'items' and 'itemsAndList')
   */
  @Query((returns) => Customers, { name: "viewCustomerDetail" })
  async viewCustomerDetail(
    /**
    @Args The options object allows us to specify the following optional key value pairs:

    - type: a function returning the GraphQL type
    - defaultValue: a default value; any
    - description: description metadata; string
    - deprecationReason: to deprecate a field and provide meta data describing why; string
    - nullable: whether the field is nullable
     */
    @Args("id", { type: () => String }) id: string
  ): Promise<Customers> {
    const customer = await this.customersService.findOne({ id });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return customer;
  }

  @Query((returns) => PaginatedCustomers, {
    name: "paginateCustomers",
  })
  async paginateCustomers(
    /**
     Dedicated arguments class
    Instead, you can create a dedicated GetAuthorArgs arguments class and access it in the handler method as follows:
    @Args() args: GetAuthorArgs 
     */
    @Args()
    filters: PaginateCustomersArgs
  ) {
    const result = await this.customersService.paginate(
      filters,
      filters.page,
      filters.limit,
      filters.order_by,
      filters.order
    );
    return result;
  }

  @Mutation((returns) => Customers, { name: "updateCustomer" })
  async updateCustomer(@Args("updateCustomerArgs") data: UpdateCustomerArgs) {
    const exist_user = await this.customersService.findOne({
      id: data.id,
    });
    if (!exist_user) {
      throw new NotFoundException("Customer not found");
    }
    const customer = await this.customersService.updateOne(data.id, data);
    return customer;
  }

  @Mutation((returns) => Boolean, { name: "deleteCustomer" })
  async deleteCustomer(@Args("id") id: string) {
    const exist_user = await this.customersService.findOne({
      id,
    });
    if (!exist_user) {
      throw new NotFoundException("Customer not found");
    }
    const result = await this.customersService.deleteOne(id);
    return result;
  }
}
