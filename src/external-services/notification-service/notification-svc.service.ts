import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import axios from "axios";
import { APP_USERS_NOTIFICATION_SETTINGS_EVENTS } from "./notification-svc.const";

@Injectable()
export class NotificationSvcService {
  private readonly logger = new Logger(NotificationSvcService.name);
  constructor() {}

  async createAppUsersSettings(data: {
    user_id: string;
    user_email: string;
    user_phone?: string;
    user_telegram_id?: string;
    event_types: APP_USERS_NOTIFICATION_SETTINGS_EVENTS[];
    in_app_notification: boolean;
    email_notification: boolean;
    telegram_notification: boolean;
  }) {
    try {
      this.logger.log(`Creating appusers settings for user ${data.user_id}`);
      const response = await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/notification-settings/appusers-settings`,
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.NOTIFICATION_SERVICE_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `ERROR from createAppUsersNotificationSettings: ${error.response.data}`
      );
      throw new InternalServerErrorException(error.response.data);
    }
  }

  async getAppUsersSettings(user_id: string) {
    try {
      this.logger.log(`Getting appusers settings for user ${user_id}`);
      const response = await axios.get(
        `${process.env.NOTIFICATION_SERVICE_URL}/notification-settings/appusers-settings/${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.NOTIFICATION_SERVICE_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(`ERROR from getAppUsersSettings: ${error.response.data}`);
      throw new InternalServerErrorException(error.response.data);
    }
  }

  async updateAppUsersSettings(data: {
    user_id: string;
    user_email?: string;
    user_phone?: string;
    user_telegram_id?: string;
    event_types?: APP_USERS_NOTIFICATION_SETTINGS_EVENTS[];
    in_app_notification?: boolean;
    email_notification?: boolean;
    telegram_notification?: boolean;
  }) {
    try {
      this.logger.log(`Updating appusers settings for user ${data.user_id}`);
      const response = await axios.put(
        `${process.env.NOTIFICATION_SERVICE_URL}/notification-settings/appusers-settings/${data.user_id}`,
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.NOTIFICATION_SERVICE_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `ERROR from updateAppUsersSettings: ${error.response.data}`
      );
      throw new InternalServerErrorException(error.response.data);
    }
  }
}
