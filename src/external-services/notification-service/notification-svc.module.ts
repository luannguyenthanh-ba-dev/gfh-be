import { forwardRef, Module } from "@nestjs/common";
import { NotificationSvcService } from "./notification-svc.service";
import { NotificationSvcAppUsersSettingsResolver } from "./notification-svc.appusers-settings.resolver";
import { AuthModule } from "src/auth/auth.module";
import { RabbitMQModule } from "src/queue/rabbit-mq.module";

@Module({
  imports: [forwardRef(() => AuthModule), RabbitMQModule],
  providers: [NotificationSvcService, NotificationSvcAppUsersSettingsResolver],
  exports: [NotificationSvcService],
})
export class NotificationSvcModule {}
