import express from 'express';
import cors from 'cors';

import { create, NotificationLanguage } from '@open-wa/wa-automate';
import { ViewController } from '../controllers/ViewController';

const app = express();

app.use(cors());
app.use(express.json());

export class Server {
  constructor() {
    create({
      sessionId: 'optimus',
      multiDevice: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: NotificationLanguage.PTBR,
      logConsole: false,
      popup: true,
      qrTimeout: 0,
    }).then((client) => ViewController(client));
  }
}
