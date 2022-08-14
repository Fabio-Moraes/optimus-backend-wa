import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

export async function PeriodView(props: TypesViews) {
  const business = process.env.BUSINESS.replace(/ /g, '_').toLowerCase();
  const service_date = status.data.replace(/\//g, '-');

  const selectValues = [business, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND service_date = ?';

  switch (props.message.body.toLowerCase()) {
    case '1':
      status.period = 'Afternoon';
      status.view = 'HourView';
      db.query(select, selectValues, (error, results) => {
        if (error) props.client.sendText(props.message.from, alert().FailConnect);
        props.client.sendText(props.message.from, view(results).HourView);
      });
      break;

    case '2':
      status.period = 'Morning';
      status.view = 'HourView';
      db.query(select, selectValues, (error, results) => {
        if (error) props.client.sendText(props.message.from, alert().FailConnect);
        props.client.sendText(props.message.from, view(results).HourView);
      });
      break;

    case '#inicio':
      status.view = 'MainView';
      await props.client
        .sendText(props.message.from, view().MainView);
      break;

    case '#voltar':
      status.view = 'DateView';
      await props.client
        .sendText(props.message.from, view().DateView);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view().PeriodView);
      break;
  }
}
