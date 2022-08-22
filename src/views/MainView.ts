import type { TypesViews } from '../models/interfaces';

import { view } from '../messages/views';
import { alert } from '../messages/alerts';
import { Test } from '../views/TestView';
import { db } from '../database/connect';

export async function MainView(props: TypesViews) {
  const { status } = props;

  const business = process.env.BUSINESS.replace(/ /g, '_').toLowerCase();
  const phone = String(props.message.sender.id);

  const selectValues = [business, phone];
  const select = 'SELECT name, employee, identifier, service, service_date, service_time FROM optimus WHERE business = ? AND phone = ?';

  switch (props.message.body.toLocaleLowerCase()) {
    case '1':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
      await props.client
        .sendText(props.message.from, view(props).ServicesView);
      break;

    case '2':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DeleteView';
      db.query(select, selectValues, (error, results) => {
        if (error) props.client.sendText(props.message.from, alert().FailConnect);
        props.client.sendText(props.message.from, view(props, results).DeleteView);
      });
      break;

    case '3':
      break;

    case '4':
      break;

    case '0':
      await props.client
        .sendContact(props.message.sender.id, '554192626733@c.us');
      break;

    case '#perfil':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      await props.client
        .sendText(props.message.from, view(props).NameView);
      break;

    default:
      // if (status.name === '') status.name = props.message.body;
      // await props.client.sendText(props.message.from, view().MainView);
      Test(props);
      break;
  }
}
