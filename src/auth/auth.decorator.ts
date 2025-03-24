import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { ANY_USER, ROLES_KEY } from "./auth.const";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { USER_ROLES } from "src/common/utils/constants.util";

/**
 * Decorator roles, that use for check authorization on api
 * @param {ROLES[]} roles example: 'super_admin','admin','user',...
 */
export const Roles = (...roles: USER_ROLES[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorator for anyone if he has account that can check authentication
 */
export const AnyUser = () => SetMetadata(ANY_USER, true);

/**
 * Decorator for get user info instead of declare user in every function need user info
 * Only apply when we have auth decorator
 * We can use this decorator like @Body - or - @Params in router functions
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) {
      throw new ForbiddenException("ERROR: Not have user data to use!");
    }
    return req.user;
  }
);

/**
 * Decorator composition - Nest provides a helper method to compose multiple decorators
 * @returns new decorator
 */
export function Auth(...roles: USER_ROLES[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles), // Can use @Role if we don`t want to use compos decorator auth
    UseGuards(AuthGuard, RolesGuard)
  );
}
