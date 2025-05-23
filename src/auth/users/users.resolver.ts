import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Users } from "./models/users.model";
import {
  ForbiddenException,
  Logger,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../auth.decorator";
import { USER_ROLES, UserProfile } from "src/common/utils/constants.util";
import { UpdateUserInfoArgs, PaginateUsersArgs } from "./dtos";
import { PaginatedUsers } from "./models/paginated-users.model";

@Resolver((of) => Users)
export class UsersResolver {
  private logger = new Logger(UsersResolver.name);
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN)
  @Query(() => Users, { name: "getUserById" })
  async getUserById(@Args("id", { type: () => ID }) id: string) {
    const user = this.usersService.findOne({ id });
    if (!user) {
      throw new NotFoundException("Not found user!");
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Users, { name: "updateUserInfo" })
  async updateUserInfo(
    @Args("updateUserInfoArgs") updateUserInfoArgs: UpdateUserInfoArgs,
    @UserProfile() actionUser: Partial<Users>
  ) {
    // Add before the update
    this.logger.log(`User ${actionUser.email} updating user ${updateUserInfoArgs.id}`);

    // Check if user exists
    const targetUser = await this.usersService.findOne({ id: updateUserInfoArgs.id });
    if (!targetUser) {
      throw new NotFoundException("User not found!");
    }

    // Check permissions
    const isOwner = actionUser.id === updateUserInfoArgs.id;
    const isAdmin = actionUser.role === USER_ROLES.ADMIN;
    const isSuperAdmin = actionUser.role === USER_ROLES.SUPER_ADMIN;

    // If target user is Super Admin, only they can modify their own info
    if (targetUser.role === USER_ROLES.SUPER_ADMIN && !isOwner) {
      throw new ForbiddenException("Super Admin can only be modified by themselves!");
    }

    // If not owner or admin/superadmin, deny access
    if (!isOwner && !isAdmin && !isSuperAdmin) {
      throw new ForbiddenException("You don't have permission to update this user!");
    }

    // Handle role updates
    if (updateUserInfoArgs.role) {
      // Only admin and superadmin can update roles
      if (!isAdmin && !isSuperAdmin) {
        throw new ForbiddenException("You don't have permission to update user roles!");
      }

      // Admin can only set role to NORMAL_USER or ADMIN
      if (isAdmin && !isSuperAdmin && updateUserInfoArgs.role === USER_ROLES.SUPER_ADMIN) {
        throw new ForbiddenException("Admin cannot set Super Admin role!");
      }

      // Prevent changing Super Admin role
      if (targetUser.role === USER_ROLES.SUPER_ADMIN) {
        throw new ForbiddenException("Super Admin role cannot be modified!");
      }
    }

    // Update user
    return this.usersService.updateOne(updateUserInfoArgs.id, updateUserInfoArgs);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN)
  @Query(() => PaginatedUsers, { name: "paginateUsers" })
  async paginateUsers(@Args() filters: PaginateUsersArgs) {
    const result = await this.usersService.paginate(
      filters,
      filters.page,
      filters.limit,
      filters.order_by,
      filters.order
    );
    return result;
  }
}
