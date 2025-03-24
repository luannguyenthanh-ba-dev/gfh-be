import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "./entities/users.entity";
import { Repository } from "typeorm";
import { IUserFilters } from "./users.interfaces";
import { Oder, paginate } from "src/common/utils/constants.util";

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>
  ) {}

  query() {
    return this.users.createQueryBuilder("user_profiles");
  }

  async create(data: Partial<UsersEntity>) {
    const new_entity = this.users.create(data);
    const user = await this.users.save(new_entity);
    return user;
  }

  async findOne(filters: IUserFilters) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("user_profiles.id = :id", { id: filters.id });
    }

    if (filters.auth0_user_id) {
      query.andWhere("user_profiles.auth0_user_id = :auth0_user_id", {
        auth0_user_id: filters.auth0_user_id,
      });
    }

    if (filters.name) {
      query.andWhere(
        "user_profiles.first_name LIKE :name OR user_profiles.last_name LIKE :name",
        { name: `%${filters.name}%` }
      );
    }

    if (filters.email) {
      query.andWhere("user_profiles.email = :email", { email: filters.email });
    }

    if (filters.phone) {
      query.andWhere("user_profiles.phone = :phone", { phone: filters.phone });
    }

    if (filters.role) {
      query.andWhere("user_profiles.role = :role", { role: filters.role });
    }

    const result = await query.getOne();
    return result;
  }

  async findAll(filters: IUserFilters) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("user_profiles.id = :id", { id: filters.id });
    }

    if (filters.auth0_user_id) {
      query.andWhere("user_profiles.auth0_user_id = :auth0_user_id", {
        auth0_user_id: filters.auth0_user_id,
      });
    }

    if (filters.name) {
      query.andWhere(
        "user_profiles.first_name LIKE :name OR user_profiles.last_name LIKE :name",
        { name: `%${filters.name}%` }
      );
    }

    if (filters.email) {
      query.andWhere("user_profiles.email = :email", { email: filters.email });
    }

    if (filters.phone) {
      query.andWhere("user_profiles.phone = :phone", { phone: filters.phone });
    }

    if (filters.role) {
      query.andWhere("user_profiles.role = :role", { role: filters.role });
    }

    try {
      const result = await query.getManyAndCount();
      return { data: result[0], total: result[1] };
    } catch (error) {
      this.logger.log(
        `Find all users met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async paginate(
    filters: IUserFilters,
    page: string | number = 1,
    limit: string | number = 10,
    order_by: string = "created_at",
    order: Oder = Oder.DESC
  ) {
    const query = this.query();

    if (filters.id) {
      query.andWhere("user_profiles.id = :id", { id: filters.id });
    }

    if (filters.auth0_user_id) {
      query.andWhere("user_profiles.auth0_user_id = :auth0_user_id", {
        auth0_user_id: filters.auth0_user_id,
      });
    }

    if (filters.name) {
      query.andWhere(
        "user_profiles.first_name LIKE :name OR user_profiles.last_name LIKE :name",
        { name: `%${filters.name}%` }
      );
    }

    if (filters.email) {
      query.andWhere("user_profiles.email = :email", { email: filters.email });
    }

    if (filters.phone) {
      query.andWhere("user_profiles.phone = :phone", { phone: filters.phone });
    }

    if (filters.role) {
      query.andWhere("user_profiles.role = :role", { role: filters.role });
    }

    try {
      const { p, l } = paginate(page, limit);

      const [total, data] = await Promise.all([
        query.getCount(),
        query
          .orderBy(`user_profiles.${order_by}`, order)
          .skip((p - 1) * l)
          .take(l)
          .getMany(),
      ]);

      return { items: data, total, page: p, limit: l };
    } catch (error) {
      this.logger.log(
        `Paginate users met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async updateOne(id: string, data: Partial<UsersEntity>) {
    const updateData: Partial<UsersEntity> = {};
    
    if (data.first_name) {
      updateData.first_name = data.first_name;
    }
    if (data.last_name) {
      updateData.last_name = data.last_name;
    }
    if (data.address) {
      updateData.address = data.address;
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }
    if (data.birthday) {
      updateData.birthday = data.birthday;
    }
    if (data.picture) {
      updateData.picture = data.picture;
    }
    if (data.role) {
      updateData.role = data.role;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No valid update data provided");
    }

    try {
      await this.users.update(id, updateData);
      const result = await this.users.findOneBy({ id });
      return result;
    } catch (error) {
      this.logger.log(
        `Update user info met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }
}
