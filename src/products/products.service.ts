import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsEntity } from "./entities/products.entity";
import { Repository } from "typeorm";
import { IProductFilters } from "./products.interface";
import { Oder, paginate } from "src/common/utils/constants.util";

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly products: Repository<ProductsEntity>
  ) {}

  query() {
    return this.products.createQueryBuilder("products");
  }

  async create(data: Partial<ProductsEntity>) {
    const new_entity = this.products.create(data);
    const product = await this.products.save(new_entity);
    return product;
  }

  async findOne(filters: IProductFilters) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("products.id = :id", { id: filters.id });
    }

    if (filters.name) {
      query.andWhere("products.name LIKE :name", { name: `%${filters.name}%` });
    }

    if (filters.price) {
      query.andWhere("products.price = :price", { price: filters.price });
    }

    if (filters.currency) {
      query.andWhere("products.currency = :currency", {
        currency: filters.currency,
      });
    }

    if (filters.brand) {
      query.andWhere("products.brand = :brand", { brand: filters.brand });
    }

    if (filters.from) {
      query.andWhere("products.created_at >= :from", {
        from_time: new Date(filters.from),
      });
    }

    if (filters.to) {
      query.andWhere("products.created_at <= :to", {
        to_time: new Date(filters.to),
      });
    }

    const result = await query.getOne();
    return result;
  }

  async findAll(filters: IProductFilters) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("products.id = :id", { id: filters.id });
    }

    if (filters.name) {
      query.andWhere("products.name LIKE :name", { name: `%${filters.name}%` });
    }

    if (filters.price) {
      query.andWhere("products.price = :price", { price: filters.price });
    }

    if (filters.currency) {
      query.andWhere("products.currency = :currency", {
        currency: filters.currency,
      });
    }

    if (filters.brand) {
      query.andWhere("products.brand = :brand", { brand: filters.brand });
    }

    if (filters.from) {
      query.andWhere("products.created_at >= :from", {
        from_time: new Date(filters.from),
      });
    }

    if (filters.to) {
      query.andWhere("products.created_at <= :to", {
        to_time: new Date(filters.to),
      });
    }

    try {
      const result = await query.getManyAndCount();
      return { data: result[0], total: result[1] };
    } catch (error) {
      this.logger.log(
        `Find all products met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async paginate(
    filters: IProductFilters,
    page: string | number = 1,
    limit: string | number = 10,
    order_by: string = "created_at",
    order: Oder = Oder.DESC
  ) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("products.id = :id", { id: filters.id });
    }

    if (filters.name) {
      query.andWhere("products.name LIKE :name", { name: `%${filters.name}%` });
    }

    if (filters.price) {
      query.andWhere("products.price = :price", { price: filters.price });
    }

    if (filters.currency) {
      query.andWhere("products.currency = :currency", {
        currency: filters.currency,
      });
    }

    if (filters.brand) {
      query.andWhere("products.brand = :brand", { brand: filters.brand });
    }

    if (filters.from) {
      query.andWhere("products.created_at >= :from", {
        from_time: new Date(filters.from),
      });
    }

    if (filters.to) {
      query.andWhere("products.created_at <= :to", {
        to_time: new Date(filters.to),
      });
    }

    try {
      const { p, l } = paginate(page, limit);

      const [total, data] = await Promise.all([
        query.getCount(),
        query
          .orderBy(`products.${order_by}`, order)
          .skip((p - 1) * l)
          .take(l)
          .getMany(),
      ]);

      return { items: data, total, page: p, limit: l };
    } catch (error) {
      this.logger.log(
        `Paginate products met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async updateOne(id: string, data: Partial<ProductsEntity>) {
    const updateData: Partial<ProductsEntity> = {};
    if (data.name) {
      updateData.name = data.name;
    }
    if (data.price) {
      updateData.price = data.price;
    }
    if (data.currency) {
      updateData.currency = data.currency;
    }
    if (data.brand) {
      updateData.brand = data.brand;
    }
    if (data.stock) {
      updateData.stock = data.stock;
    }
    try {
      await this.products.update(id, updateData);
      const result = await this.products.findOneBy({ id });
      return result;
    } catch (error) {
      this.logger.log(
        `Update product info met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async deleteOne(id: string) {
    try {
      await this.products.delete(id);
      return true;
    } catch (error) {
      this.logger.log(
        `Delete product met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }
}
