import { create, NotificationLanguage } from "@open-wa/wa-automate";
import { ViewController } from "./controllers/ViewController";

class Server {
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
    }).then(ViewController);
  }
}

new Server();
