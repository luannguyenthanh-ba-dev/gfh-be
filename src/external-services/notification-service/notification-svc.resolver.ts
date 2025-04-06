import { Resolver } from "@nestjs/graphql";
import { NotificationSvcService } from "./notification-svc.service";

@Resolver()
export class NotificationSvcResolver {
  constructor(
    private readonly notificationSvcService: NotificationSvcService
  ) {}
}
