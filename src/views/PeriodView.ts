import type { TypesViews, TypesSession } from '../models/interfaces';
import { CleanStatus } from '../components/CleanStatus';

import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

import sessionJson from '../config/Session.json';

export async function PeriodView(props: TypesViews) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  const business = session.Business.replace(/ /g, '_').toLowerCase();
  const service_date = status[`DATE${props.message.sender.id}`.split('@')[0]].replace(/\//g, '-');

  const employee = status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]]
    .toLowerCase()
    .replace(/(\/)|(\s)/g, '_')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const selectValues = [business, employee, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND employee = ? AND service_date = ?';

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
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
      CleanStatus(props);
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
