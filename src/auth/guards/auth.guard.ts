import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql"; // Added for GraphQL context
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { AUTH0_API } from "../auth.const";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);
  private internal_service_API_key: string;
  private auth0_domain: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService
  ) {
    this.auth0_domain = process.env.AUTH0_DOMAIN;
    this.internal_service_API_key = process.env.INTERNAL_SERVICE_API_KEY;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log(
      `Request to route: ${context.getClass().name}.${
        context.getHandler().name
      }`
    );

    const ctx = GqlExecutionContext.create(context); // Use GqlExecutionContext
    const request = ctx.getContext().req; // Extract request from GraphQL context
    const token = request.headers["authorization"];

    const apiKey = request.headers["api-key"] as string;
    // Note: When we use internal API Key we must accept cross call all feature and pass the role guard too!
    if (apiKey) {
      if (apiKey !== this.internal_service_API_key) {
        this.logger.error(
          "ERROR from AuthGuard: Unauthorized for internal service calling!"
        );
        throw new UnauthorizedException(
          "ERROR: Unauthorized for internal service calling!"
        );
      }
      return true;
    }

    if (!token) {
      this.logger.error("ERROR from AuthGuard: Not have user token!");
      throw new ForbiddenException("ERROR: Not have user token!");
    }

    // Handle JWT with Auth0
    request.user = await this.getUserProfile(token);
    return true;
  }

  async getUserProfile(accessToken: string) {
    const url = AUTH0_API.USER_INFO(this.auth0_domain);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: accessToken },
        })
      );

      if (!response.data.email_verified) {
        throw new ForbiddenException("Email is not verified!");
      }

      const user = await this.usersService.findOne({
        auth0_user_id: response.data.sub,
      });
      if (!user) {
        throw new ForbiddenException("Not found user profile!");
      }

      return user;
    } catch (error) {
      this.logger.error(
        `ERROR from Auth User: ${
          JSON.stringify(error?.response?.data) || error?.message
        }`
      );
      throw new ForbiddenException(
        JSON.stringify(error?.response?.data) || error?.message
      );
    }
  }
}
