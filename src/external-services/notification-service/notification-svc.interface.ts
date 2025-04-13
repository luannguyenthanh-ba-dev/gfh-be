import { NOTIFICATION_TYPES } from "./notification-svc.const";

export interface GeneralNotificationFormat {
  recipients: {
    user_id: string;
    user_email?: string;
    user_phone?: string;
    user_telegram_id?: string;
  }[];
  type: NOTIFICATION_TYPES;
  data: Partial<Record<string, any>>;
}
