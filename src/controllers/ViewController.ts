import type { Client } from '@open-wa/wa-automate';
// import { status } from '../global/status';
import 'moment/locale/pt-br';

import { ServicesView } from '../views/ServicesView';
import { PeriodView } from '../views/PeriodView';
import { HourView } from '../views/HourView';
import { NameView } from '../views/NameView';
import { DateView } from '../views/DateView';
import { MainView } from '../views/MainView';
import { CouponView } from '../views/CouponView';

// interface statusType {
//   [k: string]: string
// }
// status[`USER${message.sender.id}`.split('@')[0]] = `aaaaaaaaaaaa${message.sender.id}`;

// const status: statusType = {
//   asd: '',
//   view: 'NameView',
//   name: '',
//   service: '',
//   data: '',
//   period: '',
//   coupon: '',
//   contact: '',
// };

export function ViewController(client: Client) {
  const status: { [k: string]: string } = {};

  client.onMessage(async (message) => {
    switch (status[`VIEW${message.sender.id}`.split('@')[0]]) {
      case 'MainView':
        await MainView({ client, message, status });
        break;

      case 'ServicesView':
        await ServicesView({ client, message, status });
        break;

      case 'PeriodView':
        await PeriodView({ client, message, status });
        break;

      case 'DateView':
        await DateView({ client, message, status });
        break;

      case 'HourView':
        await HourView({ client, message, status });
        break;

      case 'CouponView':
        await CouponView({ client, message, status });
        break;

      default:
        await NameView({ client, message, status });
        break;
    }
  });
}
