import type { Client } from '@open-wa/wa-automate';
import { status } from '../global/status';
import 'moment/locale/pt-br';

import { ServicesView } from '../views/ServicesView';
import { PeriodView } from '../views/PeriodView';
import { HourView } from '../views/HourView';
import { NameView } from '../views/NameView';
import { DateView } from '../views/DateView';
import { MainView } from '../views/MainView';
import { CouponView } from '../views/CouponView';

export function ViewController(client: Client) {
  client.onMessage(async (message) => {
    switch (status.view) {
      case 'MainView':
        await MainView({ client, message });
        break;

      case 'ServicesView':
        await ServicesView({ client, message });
        break;

      case 'NameView':
        await NameView({ client, message });
        break;

      case 'PeriodView':
        await PeriodView({ client, message });
        break;

      case 'DateView':
        await DateView({ client, message });
        break;

      case 'HourView':
        await HourView({ client, message });
        break;

      case 'CouponView':
        await CouponView({ client, message });
        break;

      default:
        break;
    }
  });
}
