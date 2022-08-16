import type { TypesViews } from '../models/interfaces';

// import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

export async function PeriodView(props: TypesViews) {
  const { status } = props;

  const business = process.env.BUSINESS.replace(/ /g, '_').toLowerCase();
  const service_date = status[`DATE${props.message.sender.id}`.split('@')[0]].replace(/\//g, '-');

  const selectValues = [business, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND service_date = ?';

  switch (props.message.body.toLowerCase()) {
    case '1':
      status[`PERIOD${props.message.sender.id}`.split('@')[0]] = 'Afternoon';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'HourView';
      db.query(select, selectValues, (error, results) => {
        if (error) props.client.sendText(props.message.from, alert().FailConnect);
        props.client.sendText(props.message.from, view(props, results).HourView);
      });
      break;

    case '2':
      status[`PERIOD${props.message.sender.id}`.split('@')[0]] = 'Morning';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'HourView';
      db.query(select, selectValues, (error, results) => {
        if (error) props.client.sendText(props.message.from, alert().FailConnect);
        props.client.sendText(props.message.from, view(props, results).HourView);
      });
      break;

    case '#inicio':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      await props.client
        .sendText(props.message.from, view(props).MainView);
      break;

    case '#voltar':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DateView';
      await props.client
        .sendText(props.message.from, view(props).DateView);
      break;

    case '#sair':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'NameView';
      await props.client
        .sendText(props.message.from, alert().Cancel);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view(props).PeriodView);
      break;
  }
}
