import { GenerateIdentifier } from '../components/GenerateIdentifier';
import type { TypesViews, TypesSession } from '../models/interfaces';
import { AddLeadingZeros } from '../components/AddLeadingZeros';
import { CleanStatus } from '../components/CleanStatus';

import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

import sessionJson from '../config/Session.json';

function parseHours(input: string) {
  const regexExp = /^([0-1]?[0-9]|2[0-3])(:)([0-5][0-9])$/gi;
  return regexExp.test(input) ? input.split(':') : ['00', '00'];
}

export async function HourView(props: TypesViews) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  function hours() {
    if (status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Morning') {
      return session.Morning.split(', ').map((item) => `${item}:00`);
    }

    if (status[`PERIOD${props.message.sender.id}`.split('@')[0]] === 'Afternoon') {
      return session.Afternoon.split(', ').map((item) => `${item}:00`);
    }
    return [];
  }

  const splitHours = parseHours(props.message.body);
  const inputHours = [
    AddLeadingZeros(splitHours[0], 2),
    AddLeadingZeros(splitHours[1], 2),
    '00'];

  const business = session.Business.toLowerCase().replace(/ /g, '_');
  const name = status[`NAME${props.message.sender.id}`.split('@')[0]].replace(/ /g, '_');
  const phone = String(props.message.sender.id);
  const identifier = GenerateIdentifier(4);
  const service_date = status[`DATE${props.message.sender.id}`.split('@')[0]].replace(/\//g, '-');
  const service_time = inputHours.join(':');

  const employee = status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]]
    .toLowerCase()
    .replace(/(\/)|(\s)/g, '_')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const service = status[`SERVICE${props.message.sender.id}`.split('@')[0]]
    .toLowerCase()
    .replace(/(\/)|(\s)/g, '_')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const indexHours = (value: number) => hours()[Number(hours()
    .map((item, index) => (item === service_time ? index : ''))
    .filter((item) => String(item))[0]) + value];

  const selectValues = [business, employee, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND employee = ? AND service_date = ?;';

  const ValidateHours = (results: Array<{ service_time: string }>, selectHours: string) => {
    if (!selectHours) return false;
    return !results?.filter((item) => item.service_time === selectHours).length;
  };

  const insertValues = [
    business, employee, name, phone, service, identifier, service_date, service_time];
  const insert = 'INSERT INTO optimus SET business = ?, employee = ?, name = ?, phone = ?, service = ?, identifier = ?, service_date = ?, service_time = ?;';

  const dualInsertValues = (results: Array<{ service_time: string }>) => {
    if (ValidateHours(results, indexHours(1))) {
      return [business, employee, name, phone, service, identifier, service_date, service_time,
        business, employee, name, phone, service, identifier, service_date, indexHours(1)];
    }

    if (ValidateHours(results, indexHours(-1))) {
      return [business, employee, name, phone, service, identifier, service_date, service_time,
        business, employee, name, phone, service, identifier, service_date, indexHours(-1)];
    }
    return [];
  };
  const dualInsert = 'INSERT INTO optimus (business, employee, name, phone, service, identifier, service_date, service_time) VALUES(?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?);';

  switch (props.message.body.toLowerCase()) {
    case '#inicio':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      await props.client.sendText(props.message.from, view(props).MainView);
      break;

    case '#voltar':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'PeriodView';
      await props.client.sendText(props.message.from, view(props).PeriodView);
      break;

    case '#sair':
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
      CleanStatus(props);
      await props.client
        .sendText(props.message.from, alert().Cancel);
      break;

    default:
      db.query(select, selectValues, (errorSelect, results) => {
        if (errorSelect) {
          props.client.sendText(props.message.from, `${errorSelect}0`);
          props.client.sendText(props.message.from, alert().FailConnect);
          props.client.sendText(props.message.from, view(results).HourView);
        }

        if (hours().includes(inputHours.join(':'))) {
          if (errorSelect) {
            props.client.sendText(props.message.from, alert().FailConnect);
            props.client.sendText(props.message.from, view(results).HourView);
          }

          if (service === 'corte_de_cabelo') {
            if (ValidateHours(results, service_time)) {
              db.query(insert, insertValues, (errorInsert) => {
                if (errorInsert) {
                  props.client.sendText(props.message.from, `${errorSelect}1`);
                  props.client.sendText(props.message.from, alert().FailConnect);
                  props.client.sendText(props.message.from, view(results).HourView);
                }
                status[`identifier${props.message.sender.id}`.split('@')[0]] = identifier;
                status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'IdentifierView';
                props.client.sendText(props.message.from, view(props).IdentifierView);
              });
            } else props.client.sendText(props.message.from, alert().TimeNotAvailable);
          } else if (ValidateHours(results, service_time)) {
            if (ValidateHours(results, indexHours(1))
              || ValidateHours(results, indexHours(-1))) {
              db.query(dualInsert, dualInsertValues(results), (errorInsert) => {
                if (errorInsert) {
                  props.client.sendText(props.message.from, `${errorSelect}2`);
                  props.client.sendText(props.message.from, alert().FailConnect);
                  props.client.sendText(props.message.from, view(props, results).HourView);
                }
                status[`identifier${props.message.sender.id}`.split('@')[0]] = identifier;
                status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'IdentifierView';
                props.client.sendText(props.message.from, view(props).IdentifierView);
              });
            } else props.client.sendText(props.message.from, alert().TimeNotAvailable);
          } else props.client.sendText(props.message.from, alert().TimeNotAvailable);
        } else {
          props.client.sendText(props.message.from, `${errorSelect}3`);
          props.client.sendText(props.message.from, alert().InvalidTextFormat);
          props.client.sendText(props.message.from, view(props, results).HourView);
        }
      });
      break;
  }
}
