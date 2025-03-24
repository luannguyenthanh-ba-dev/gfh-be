import {
  BadRequestException,
  Logger,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Users } from "./users/models/users.model";
import { LoginArgs, RegisterNewUserArgs } from "./dtos";
import { USER_ROLES, UserProfile } from "src/common/utils/constants.util";
import { UsersService } from "./users/users.service";
import { Throttle } from "@nestjs/throttler";
import { AuthGuard } from "./guards/auth.guard";
import { UsersEntity } from "./users/entities/users.entity";
import { LoginResult } from "./models/auth.model";

@Resolver()
export class AuthResolver {
  private logger = new Logger(AuthResolver.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  // Consider adding rate limiting to prevent abuse
  // The time to live in milliseconds & the maximum number of requests within the ttl
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @Mutation(() => Users, { name: "registerNewUser" })
  async register(@Args("registerNewUserArgs") data: RegisterNewUserArgs) {
    const existedUser = await this.usersService.findOne({ email: data.email });
    if (existedUser) {
      throw new BadRequestException("User already exists");
    }
    data.first_name = data.first_name.trim();
    data.last_name = data.last_name.trim();

    const userAuth0 = await this.authService.registerAuth0({
      ...data,
      role: USER_ROLES.NORMAL_USER,
    });

    const user = await this.usersService.create({
      auth0_user_id: "auth0|" + userAuth0._id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: USER_ROLES.NORMAL_USER,
      phone: data.phone,
      address: data.address,
      birthday: data.birthday,
      picture: data.picture,
    });

    this.logger.log(`User registration attempt for email: ${data.email}`);
    return user;
  }

 @UseGuards(AuthGuard)
  @Query(() => Users, { name: "me" })
  async me(@UserProfile() user: Partial<UsersEntity>) {
    return user;
  } 

  @Mutation(() => LoginResult, { name: "login" })
  async login(@Args("loginArgs") data: LoginArgs) {
    const existedUser = await this.usersService.findOne({ email: data.email });
    if (!existedUser) {
      throw new NotFoundException("Not found user!");
    }

    const success = await this.authService.login(data.email, data.password);
    return success;
  }
}
