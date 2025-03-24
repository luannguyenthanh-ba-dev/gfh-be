import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql'; // Import GqlExecutionContext
import { ANY_USER, ROLES_KEY } from '../auth.const';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly internalServiceAPIKey = process.env.INTERNAL_SERVICE_API_KEY;

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context); // Create GraphQL context
    const request = ctx.getContext().req; // Access the request object from GraphQL context
    const apiKey = request.headers['api-key'];
    // Note: When we use internal API Key we must accept cross call all feature and pass the role guard too!
    if (apiKey) {
      if (apiKey !== this.internalServiceAPIKey) {
        throw new UnauthorizedException(
          'ERROR: Unauthorized for internal service calling from RolesGuard!',
        );
      }
      return true;
    }

    const user = request.user;
    if (!user || !user.email) {
      return false;
    }

    // If your intent is to specify 'user' as the default role, and override it selectively for certain methods,
    // you would probably use the getAllAndOverride() method.
    const anyUser = this.reflector.getAllAndOverride<boolean>(ANY_USER, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (anyUser) {
      return true;
    }

    // Check role:
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return this.checkRole(user, roles);
  }

  // One user - One role
  private checkRole = (user, roles: string[]) => {
    if (user.role && roles.includes(user.role)) {
      return true;
    }
    return false;
  };

  // One user - Many roles
  // private checkRole = (user, roles) => {
  //   const hasRole = () =>
  //     user.role.some((role) => !!roles.find((item) => item === role));

  //   return user && user.role && hasRole();
  // };
}
