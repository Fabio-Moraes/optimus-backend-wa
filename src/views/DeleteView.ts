import moment from 'moment';
import type { TypesViews, TypesSession } from '../models/interfaces';
import { CleanStatus } from '../components/CleanStatus';

import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

import sessionJson from '../config/Session.json';

interface TypeResults {
  name: string;
  service: string;
  identifier: string;
  employee: string;
  service_time: string;
  service_date: string;
}

export async function DeleteView(props: TypesViews) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  const business = session.Business.replace(/ /g, '_').toLowerCase();
  const phone = String(props.message.sender.id);
  // const phone = '554192626233@c.us';

  const listSqlValues = [business, phone];
  const listSql = 'SELECT name, identifier, employee, service, service_date, service_time FROM optimus WHERE business = ? AND phone = ?;';

  switch (props.message.body.toLowerCase()) {
    case '#inicio':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      await props.client
        .sendText(props.message.from, view(props).MainView);
      break;

    case '#sair':
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
      CleanStatus(props);
      await props.client
        .sendText(props.message.from, alert().Cancel);
      break;

    default:
      db.query(listSql, listSqlValues, (error, results: TypeResults[]) => {
        const setResults = new Set();

        const filterResults = results.filter((res) => {
          const duplicatedIdentifier = setResults.has(res.identifier);
          setResults.add(res.identifier);
          return !duplicatedIdentifier;
        });

        if (error) {
          props.client.sendText(props.message.from, alert().FailConnect);
        } else {
          const { service_time } = filterResults
            .filter((i, index) => index === Number(props.message.body))[0];

          const { service_date } = filterResults
            .filter((i, index) => index === Number(props.message.body))[0];

          const { employee } = filterResults
            .filter((i, index) => index === Number(props.message.body))[0];

          const { name } = filterResults
            .filter((i, index) => index === Number(props.message.body))[0];

          const { service } = filterResults
            .filter((i, index) => index === Number(props.message.body))[0];

          const { identifier } = filterResults
            .filter((i, index) => index === Number(props.message.body))[0];

          const resultAlert = {
            name, employee, service, service_date, service_time,
          };

          const dateListDeleteNow = moment.utc(service_date).format('YYYY/MM/DD');

          const deleteSqlValues = [
            employee, service, phone, business, dateListDeleteNow, identifier];

          const deleteSql = 'DELETE FROM optimus WHERE employee = ? AND service = ? AND phone = ? AND business = ? AND service_date = ? AND identifier = ?;';

          if (Number(props.message.body) < results.length && Number(props.message.body) >= 0) {
            db.query(deleteSql, deleteSqlValues, (_error) => {
              if (_error) {
                props.client.sendText(props.message.from, alert().FailConnect);
              } else {
                db.query(listSql, listSqlValues, (subError, subResults: TypeResults[]) => {
                  if (subError) {
                    props.client.sendText(props.message.from, alert().FailConnect);
                  } else {
                    props.client.sendText(props.message.from, alert(resultAlert).Deleted);
                    props.client.sendText(props.message.from, view(props, subResults).DeleteView);
                  }
                });
              }
            });
          } else {
            db.query(listSql, listSqlValues, (subError, subResults: TypeResults[]) => {
              if (subError) props.client.sendText(props.message.from, alert().FailConnect);
              props.client.sendText(props.message.from, 'ID Inexistente');
              props.client.sendText(props.message.from, view(props, subResults).DeleteView);
            });
          }
        }
      });
      break;
  }
}
