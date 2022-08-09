import express from 'express';
import cors from 'cors';

import { create, NotificationLanguage } from '@open-wa/wa-automate';
import { ViewController } from '../controllers/ViewController';
// import { db } from '../database/connect';

const app = express();

app.use(cors());
app.use(express.json());

// app.get('/optimus', (req, res) => {
//   db.query('SELECT * FROM optimus', (error, results) => {
//     if (error) {
//       res.send(error);
//     }

//     res.send(results.map((item: any) => (
//       {
//         name: item.name,
//         phone: item.phone,
//         service: item.service,
//         coupon: item.coupon,
//         create_datetime: item.create_datetime,
//         service_date: item.service_date,
//         service_time: item.service_time,
//       }
//     )));
//   });
// });

// app.listen(3333);

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
