import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

export async function WhichPeriod(props: TypesViews) {
  const business = 'barbearia_optimus';
  const service_date = '2022/08/19';

  const selectValues = [business, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND service_date = ?';

  switch (props.message.body.toLowerCase()) {
    case '1':
      break;

    case '2':
      status.view = 'TimesMorning';
      db.query(select, selectValues, (error, results) => {
        if (error) props.client.sendText(props.message.from, alert().FailConnect);
        props.client.sendText(props.message.from, view(results).TimesMorning);
      });
      break;

    case '#inicio':
      status.view = 'Main';
      await props.client
        .sendText(props.message.from, view().Main);
      break;

    case '#voltar':
      status.view = 'SelectedData';
      await props.client
        .sendText(props.message.from, view().SelectedData);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view().WhichPeriod);
      break;
  }
}
