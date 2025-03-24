import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { firstValueFrom, last, lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

// import { UsersService } from '../users/users.service';
import { AUTH0_API, grant_type } from "./auth.const";
import { USER_ROLES } from "src/common/utils/constants.util";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private auth0_domain: string;
  private auth0_client_id: string;
  private auth0_client_secret: string;
  private auth0_audience: string;
  private auth0_default_connection: string;
  constructor(
    // private readonly usersService: UsersService,
    private readonly httpService: HttpService
  ) {
    this.auth0_domain = process.env.AUTH0_DOMAIN;
    this.auth0_client_id = process.env.AUTH0_CLIENT_ID;
    this.auth0_client_secret = process.env.AUTH0_CLIENT_SECRET;
    this.auth0_audience = process.env.AUTH0_AUDIENCE;
    this.auth0_default_connection = process.env.AUTH0_DEFAULT_CONNECTION;
  }

  /**
   * Process Login
   * @returns
   */
  async login(username: string, password: string) {
    const url = AUTH0_API.OAUTH_TOKEN(this.auth0_domain);
    const payload = {
      grant_type: grant_type.password,
      username: username,
      password: password,
      client_id: this.auth0_client_id,
      client_secret: this.auth0_client_secret,
      audience: this.auth0_audience,
      scope: "openid profile email offline_access read:sample",
    };
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload)
      );
      return response.data;
    } catch (error) {
      console.log(error)
      this.logger.error(
        `ERROR from Login: ${
          JSON.stringify(error?.response?.data) || error?.message
        }`
      );
      throw new InternalServerErrorException(
        JSON.stringify(error?.response?.data) || error?.message
      );
    }
  }

  async registerAuth0(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: USER_ROLES;
    address?: string;
    phone?: string;
    birthday?: string;
    picture?: string;
  }) {
    const url = AUTH0_API.AUTH0_SIGNUP(this.auth0_domain);
    const payload = {
      client_id: this.auth0_client_id,
      email: data.email,
      password: data.password,
      connection: this.auth0_default_connection,
      name: data.first_name + " " + data.last_name,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload)
      );
      return {
          _id: response.data._id,
          email: response.data.email,
      };
    } catch (error) {
      if (error.response?.status === 409) {
        throw new ConflictException('Email is already registered');
      } else if (error.response?.status === 400) {
        throw new BadRequestException('Invalid registration data');
      }
      this.logger.error(
        `ERROR from Register Auth0: ${
          JSON.stringify(error?.response?.data) || error?.message
        }`
      );
      throw new InternalServerErrorException(
        JSON.stringify(error?.response?.data) || error?.message
      );
    }
  }

  async refreshToken(rf_token: string) {
    const url = AUTH0_API.OAUTH_TOKEN(this.auth0_domain);
    const payload = {
      grant_type: grant_type.refresh_token,
      client_id: this.auth0_client_id,
      client_secret: this.auth0_client_secret,
      refresh_token: rf_token,
    };

    try {
      const response = await lastValueFrom(this.httpService.post(url, payload));
      return response.data;
    } catch (error) {
      this.logger.error(
        `ERROR from Refresh Token: ${
          JSON.stringify(error?.response?.data) || error?.message
        }`
      );
      throw new InternalServerErrorException(
        JSON.stringify(error?.response?.data) || error?.message
      );
    }
  }
}
