import moment from 'moment';
import type { TypesViews, TypesSession } from '../models/interfaces';

import { view } from '../messages/views';
import { alert } from '../messages/alerts';
// import { Test } from '../views/TestView';
import { db } from '../database/connect';

import sessionJson from '../config/Session.json';

export async function MainView(props: TypesViews) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  const business = session.Business.replace(/ /g, '_').toLowerCase();
  const phone = String(props.message.sender.id);

  const now = moment.utc().format('YYYY-MM-DD');
  const checkDate = (date: { service_date: string }) => moment
    .utc(date.service_date).valueOf() < moment.utc().valueOf();

  const selectValues = [business, phone];
  const deleteDate = 'DELETE FROM optimus WHERE service_date < ?;';
  const select = 'SELECT name, identifier, employee, service, service_date, service_time FROM optimus WHERE business = ? AND phone = ?';

  switch (props.message.body.toLocaleLowerCase()) {
    case '1':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
      await props.client
        .sendText(props.message.from, view(props).ServicesView);
      break;

    case '2':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DeleteView';
      db.query(select, selectValues, (error, results) => {
        if (error) {
          props.client.sendText(props.message.from, alert().FailConnect);
        } else if (results.some(checkDate)) {
          db.query(deleteDate, [now], (err) => {
            if (err) {
              props.client.sendText(props.message.from, alert().FailConnect);
            } else {
              props.client.sendText(props.message.from, view(props, results).DeleteView);
            }
          });
        } else props.client.sendText(props.message.from, view(props, results).DeleteView);
      });
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
      if (status[`NAME${props.message.sender.id}`.split('@')[0]] === ''
        || !status[`NAME${props.message.sender.id}`.split('@')[0]]) {
        status[`NAME${props.message.sender.id}`.split('@')[0]] = props.message.body;
      }
      await props.client.sendText(props.message.from, view(props).MainView);
      // Test(props);
      break;
  }
}
