import { Controller, Post } from "@nestjs/common";

@Controller("api")
export class AppController {
  constructor() {}

  @Post("callbacks")
  async callbacks(): Promise<string> {
    return "Success";
  }
}
