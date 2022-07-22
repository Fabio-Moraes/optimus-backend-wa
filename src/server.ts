import { create, Client, NotificationLanguage } from "@open-wa/wa-automate";

import { MoreTypesOfService } from "./messages/main/1_TypeOfServices/4_MoreTypesOfService";
import { TypeOfServices } from "./messages/main/1_TypeOfServices";
import { Main } from "./messages/main";

export class Server {
  constructor() {
    this.initialize();
  }

  private initialize() {
    create({
      sessionId: "Optimus_Prime",
      multiDevice: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: NotificationLanguage.PTBR,
      logConsole: false,
      popup: true,
      qrTimeout: 0,
    }).then((client) => {
      start(client);
    });

    function start(client: Client) {
      Main(client);
      TypeOfServices(client);
      MoreTypesOfService(client);
    }
  }
}
