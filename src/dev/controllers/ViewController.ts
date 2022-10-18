import type { Client } from '@open-wa/wa-automate';
import 'moment/locale/pt-br';

import { ServicesView } from '../views/ServicesView';
import { EmployeeView } from '../views/EmployeeView';
import { PeriodView } from '../views/PeriodView';
import { IdentifierView } from '../views/IdentifierView';
import { DeleteView } from '../views/DeleteView';
import { HourView } from '../views/HourView';
import { NameView } from '../views/NameView';
import { DateView } from '../views/DateView';
import { MainView } from '../views/MainView';

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

      case 'EmployeeView':
        await EmployeeView({ client, message, status });
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

      case 'IdentifierView':
        await IdentifierView({ client, message, status });
        break;

      case 'DeleteView':
        await DeleteView({ client, message, status });
        break;

      default:
        await NameView({ client, message, status });
        break;
    }
  });
}
