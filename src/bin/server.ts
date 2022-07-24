import express from 'express';

import { create, NotificationLanguage } from '@open-wa/wa-automate';
import { ViewController } from '../controllers/ViewController';

const app = express();

app.get('/test', (request, response) => {
  response.send('Olá, Optimus');
});

app.listen(3000);

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
