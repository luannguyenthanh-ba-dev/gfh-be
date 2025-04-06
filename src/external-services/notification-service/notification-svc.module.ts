import { Module } from "@nestjs/common";
import { NotificationSvcService } from "./notification-svc.service";

@Module({
  imports: [],
  providers: [NotificationSvcService],
  exports: [NotificationSvcService],
})
export class NotificationSvcModule {}
