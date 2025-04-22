import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import axios from "axios";
import {
  APP_USERS_NOTIFICATION_SETTINGS_EVENTS,
  NOTIFICATION_TYPES,
} from "./notification-svc.const";
import { RabbitMQService } from "../../queue/rabbit-mq.service";
import { GeneralNotificationFormat } from "./notification-svc.interface";

@Injectable()
export class NotificationSvcService {
  private readonly logger = new Logger(NotificationSvcService.name);
  private readonly notificationSvcUrl = process.env.NOTIFICATION_SERVICE_URL;
  private readonly notificationSvcApiKey =
    process.env.NOTIFICATION_SERVICE_API_KEY;
  private readonly queueName = process.env.NOTIFICATION_QUEUE_NAME;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async createAppUsersSettings(data: {
    user_id: string;
    user_email: string;
    user_phone?: string;
    user_telegram_id?: string;
    event_types: APP_USERS_NOTIFICATION_SETTINGS_EVENTS[];
    in_app_notification: boolean;
    email_notification: boolean;
    telegram_notification: boolean;
    timezone?: string;
  }) {
    try {
      this.logger.log(`Creating appusers settings for user ${data.user_id}`);
      const response = await axios.post(
        `${this.notificationSvcUrl}/notification-settings/appusers-settings`,
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": this.notificationSvcApiKey,
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
        `${this.notificationSvcUrl}/notification-settings/appusers-settings/${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": this.notificationSvcApiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `ERROR from getAppUsersSettings: ${error.response.data}`
      );
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
    timezone?: string;
  }) {
    try {
      this.logger.log(`Updating appusers settings for user ${data.user_id}`);
      const response = await axios.put(
        `${this.notificationSvcUrl}/notification-settings/appusers-settings/${data.user_id}`,
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": this.notificationSvcApiKey,
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

  async sendAppUsersNotification(data: GeneralNotificationFormat) {
    try {
      this.logger.log(
        `Sending notification to user ${data.recipients[0].user_id} for event ${data.data.event}`
      );

      // Publish the notification task to the queue
      const published = await this.rabbitMQService.publishTask(this.queueName, {
        ...data,
        timestamp: new Date().toISOString(),
      });

      if (!published) {
        throw new Error("Failed to publish notification task to queue");
      }

      this.logger.log(
        `Notification task published to queue ${this.queueName} for user ${data.recipients[0].user_id}`
      );
      return { success: true, message: "Notification task published to queue" };
    } catch (error) {
      this.logger.error(`ERROR from sendNotification: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserInAppNotifications(
    user_id: string,
    filters: {
      is_read?: boolean;
      type?: NOTIFICATION_TYPES;
      limit?: number;
      page?: number;
      sort_by?: string;
      sort_order?: number;
    }
  ) {
    try {
      console.log(`${this.notificationSvcUrl}/in-app-notifications/${user_id}`);
      this.logger.log(`Getting in-app notifications for user ${user_id}`);
      const response = await axios.get(
        `${this.notificationSvcUrl}/in-app-notifications/users/${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": this.notificationSvcApiKey,
          },
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `ERROR from getUserInAppNotifications: ${error.message}`
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
