import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CustomersEntity } from "./entities/customers.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerGenders } from "./customers.const";
import { Repository } from "typeorm";
import { ICustomerFilters } from "./customers.interface";
import { Oder, paginate } from "src/common/utils/constants.util";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly customers: Repository<CustomersEntity>
  ) {}

  query() {
    return this.customers.createQueryBuilder("customers");
  }

  async create(data: Partial<CustomersEntity>) {
    const new_entity = this.customers.create(data);
    const customer = await this.customers.save(new_entity);
    return customer;
  }

  async findOne(filters: ICustomerFilters) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("customers.id = :id", { id: filters.id });
    }

    if (filters.email) {
      query.andWhere("customers.email = :email", { email: filters.email });
    }

    if (filters.name) {
      query.andWhere(
        "customers.first_name LIKE :name OR customers.last_name LIKE :name",
        { name: `%${filters.name}%` }
      );
    }
    if (filters.search) {
      query.orWhere(
        "customers.first_name LIKE :search OR customers.last_name LIKE :search OR customers.email LIKE :search OR customers.phone LIKE :search",
        { search: `%${filters.search}%` }
      );
    }

    const result = await query.getOne();
    return result;
  }

  async findAll(filters: ICustomerFilters) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("customers.id = :id", { id: filters.id });
    }

    if (filters.email) {
      query.andWhere("customers.email = :email", { email: filters.email });
    }

    if (filters.name) {
      query.andWhere(
        "customers.first_name LIKE :name OR customers.last_name LIKE :name",
        { name: `%${filters.name}%` }
      );
    }
    if (filters.search) {
      query.orWhere(
        "customers.first_name LIKE :search OR customers.last_name LIKE :search OR customers.email LIKE :search OR customers.phone LIKE :search",
        { search: `%${filters.search}%` }
      );
    }

    try {
      const result = await query.getManyAndCount();
      return { data: result[0], total: result[1] };
    } catch (error) {
      this.logger.log(
        `Find all customers met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async paginate(
    filters: ICustomerFilters,
    page: string | number = 1,
    limit: string | number = 10,
    order_by: string = "created_at",
    order: Oder = Oder.DESC
  ) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("customers.id = :id", { id: filters.id });
    }

    if (filters.email) {
      query.andWhere("customers.email = :email", { email: filters.email });
    }

    if (filters.name) {
      query.andWhere(
        "customers.first_name LIKE :name OR customers.last_name LIKE :name",
        { name: `%${filters.name}%` }
      );
    }
    if (filters.search) {
      query.orWhere(
        "customers.first_name LIKE :search OR customers.last_name LIKE :search OR customers.email LIKE :search OR customers.phone LIKE :search",
        { search: `%${filters.search}%` }
      );
    }

    try {
      const { p, l } = paginate(page, limit);

      const [total, data] = await Promise.all([
        query.getCount(),
        query
          .orderBy(`customers.${order_by}`, order)
          .skip((p - 1) * l)
          .take(l)
          .getMany(),
      ]);

      return { data, total };
    } catch (error) {
      this.logger.log(
        `Paginate customers met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async updateOne(
    id: string,
    data: {
      first_name?: string;
      last_name?: string;
      address?: string;
      birthday?: string;
      gender?: CustomerGenders;
    }
  ) {
    const updateData: Partial<CustomersEntity> = {};
    if (data.first_name) {
      updateData.first_name = data.first_name;
    }
    if (data.last_name) {
      updateData.last_name = data.last_name;
    }
    if (data.address) {
      updateData.address = data.address;
    }
    if (data.birthday) {
      updateData.birthday = data.birthday;
    }
    if (data.gender) {
      updateData.gender = data.gender;
    }
    try {
      await this.customers.update(id, updateData);
      const result = await this.customers.findOneBy({ id });
      return result;
    } catch (error) {
      this.logger.log(
        `Update customer info met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async deleteOne(id: string) {
    try {
      await this.customers.delete(id);
      return true;
    } catch (error) {
      this.logger.log(
        `Delete customer met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }
}
