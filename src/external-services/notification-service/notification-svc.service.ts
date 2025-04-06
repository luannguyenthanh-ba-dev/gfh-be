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

  async createAppUsersNotificationSettings(data: {
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
      this.logger.log(
        `Creating appusers notification settings for user ${data.user_id}`
      );
      console.log(
        `${process.env.NOTIFICATION_SERVICE_URL}/appusers-notification-settings`
      );
      const response = await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/appusers-notification-settings`,
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
}
