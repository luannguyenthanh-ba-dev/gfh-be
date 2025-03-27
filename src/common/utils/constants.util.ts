import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import {
  ArgsType,
  Field,
  GqlExecutionContext,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export enum USER_ROLES {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  NORMAL_USER = "normal_user",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum Oder {
  ASC = "ASC",
  DESC = "DESC",
}

// ✅ Register the enum with GraphQL
registerEnumType(Oder, {
  name: "Oder", // Name to be used in GraphQL Schema
});

export enum LicenseStatus {
  PENDING_ACTIVATION = "PENDING_ACTIVATION",
  ACTIVATED = "ACTIVATED",
  DEACTIVATED = "DEACTIVATED",
  REVOKED = "REVOKED",
}

@ArgsType()
export class PaginationArgs {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field(() => Int, { nullable: true })
  @IsNumberString()
  @IsOptional()
  page?: string | number = "1";

  @Field(() => Int, { nullable: true })
  @IsNumberString()
  @IsOptional()
  limit?: string | number = "10";

  @Field(() => String, { nullable: true, defaultValue: "created_at" })
  @IsString()
  @IsOptional()
  order_by?: string = "created_at";

  @Field(() => Oder, { nullable: true, defaultValue: Oder.DESC })
  @IsEnum(Oder)
  @IsOptional()
  order?: Oder = Oder.DESC;
}

export function paginate(
  page: string | number,
  limit: string | number
): { p: number; l: number } {
  const pageNumber = typeof page === "string" ? parseInt(page, 10) : page;
  const limitNumber = typeof limit === "string" ? parseInt(limit, 10) : limit;
  return { p: pageNumber, l: limitNumber };
}

export const CanManageObjects = (
  user: any,
  object: any,
  only_super_admin = false
): boolean => {
  if (user.role !== USER_ROLES.SUPER_ADMIN && only_super_admin) {
    return false;
  }
  if (user.role === USER_ROLES.SUPER_ADMIN || user.role === USER_ROLES.ADMIN) {
    return true;
  } else {
    return object.owner_id === user.id;
  }
};

// ✅ Register the enum with GraphQL
registerEnumType(USER_ROLES, {
  name: "USER_ROLES", // Name to be used in GraphQL Schema
});

/**
 * Decorator for get user info instead of declare user in every function need user info
 * Only apply when we have auth decorator
 * We can use this decorator like @Body - or - @Params in router functions
 */
export const UserProfile = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (!request.user) {
      throw new ForbiddenException("ERROR: Not have user data to use!");
    }
    return request.user;
  }
);

// Helper function to create date in user's timezone
export const createDateInTimezone = (
  dateString?: string,
  timezone: string = "Asia/Ho_Chi_Minh"
) => {
  if (!dateString) {
    // Current date in user's timezone
    return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
  }

  // Parse specified date in user's timezone
  return new Date(
    new Date(dateString).toLocaleString("en-US", { timeZone: timezone })
  );
};
