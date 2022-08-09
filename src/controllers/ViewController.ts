import type { Client } from '@open-wa/wa-automate';
import { status } from '../global/status';
import 'moment/locale/pt-br';

import { TimesMorning } from '../views/TimesMorning';
import { TypesOfServices } from '../views/TypesOfServices';
import { SelectedName } from '../views/SelectedName';
import { SelectedData } from '../views/SelectedData';
import { WhichPeriod } from '../views/WhichPeriod';
import { Main } from '../views/Main';

export function ViewController(client: Client) {
  client.onMessage(async (message) => {
    switch (status.view) {
      case 'Main':
        await Main({ client, message });
        break;

      case 'TypesOfServices':
        await TypesOfServices({ client, message });
        break;

      case 'SelectedName':
        await SelectedName({ client, message });
        break;

      case 'WhichPeriod':
        await WhichPeriod({ client, message });
        break;

      case 'SelectedData':
        await SelectedData({ client, message });
        break;

      case 'TimesMorning':
        await TimesMorning({ client, message });
        break;

      default:
        break;
    }
  });
}
