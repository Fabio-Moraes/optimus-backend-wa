import { GenerateCoupon } from '../components/GenerateCoupon';
import type { TypesViews } from '../models/interfaces';
import { AddLeadingZeros } from '../components/AddLeadingZeros';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

const hours = [
  '07:30:00',
  '08:00:00',
  '08:30:00',
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '12:00:00'];

function parseHours(input: string) {
  const regexExp = /^([0-1]?[0-9]|2[0-3])(:)([0-5][0-9])$/gi;
  return regexExp.test(input) ? input.split(':') : ['00', '00'];
}

export async function TimesMorning(props: TypesViews) {
  const splitHours = parseHours(props.message.body);
  const inputHours = [
    AddLeadingZeros(splitHours[0], 2),
    AddLeadingZeros(splitHours[1], 2),
    '00'];

  const business = 'barbearia_optimus';
  const name = status.name.replace(/ /g, '_');
  const phone = String(props.message.sender.id);
  const { service } = status;
  const coupon = GenerateCoupon(4);
  const service_date = status.data.replace(/\//g, '-');
  const service_time = inputHours.join(':');

  const indexHours = (value: number) => hours[Number(hours
    .map((item, index) => (item === service_time ? index : ''))
    .filter((item) => String(item))[0]) + value];

  const selectValues = [business, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND service_date = ?';

  const ValidateHours = (results: Array<{ service_time: string }>, selectHours: string) => {
    if (!selectHours) return false;
    return !results?.filter((item) => item.service_time === selectHours).length;
  };

  const insertValues = [business, name, phone, service, coupon, service_date, service_time];
  const insert = 'INSERT INTO optimus SET business = ?, name = ?, phone = ?, service = ?, coupon = ?, service_date = ?, service_time = ?;';

  const dualInsertValues = (results: Array<{ service_time: string }>) => {
    if (ValidateHours(results, indexHours(1))) {
      return [business, name, phone, service, coupon, service_date, service_time,
        business, name, phone, service, coupon, service_date, indexHours(1)];
    }

    if (ValidateHours(results, indexHours(-1))) {
      return [business, name, phone, service, coupon, service_date, service_time,
        business, name, phone, service, coupon, service_date, indexHours(-1)];
    }
    return [];
  };
  const dualInsert = 'INSERT INTO optimus (business, name, phone, service, coupon, service_date, service_time) VALUES(?,?,?,?,?,?,?), (?,?,?,?,?,?,?);';

  switch (props.message.body.toLowerCase()) {
    case '#inicio':
      status.view = 'Main';
      await props.client.sendText(props.message.from, view().Main);
      break;

    case '#voltar':
      status.view = 'WhichPeriod';
      await props.client.sendText(props.message.from, view().WhichPeriod);
      break;

    default:
      db.query(select, selectValues, (errorSelect, results) => {
        if (errorSelect) {
          props.client.sendText(props.message.from, alert().FailConnect);
          props.client.sendText(props.message.from, view(results).TimesMorning);
        }

        if (hours.includes(inputHours.join(':'))) {
          if (errorSelect) {
            props.client.sendText(props.message.from, alert().FailConnect);
            props.client.sendText(props.message.from, view(results).TimesMorning);
          }

          if (service === 'corte_de_cabelo') {
            if (ValidateHours(results, service_time)) {
              db.query(insert, insertValues, (errorInsert) => {
                if (errorInsert) {
                  props.client.sendText(props.message.from, alert().FailConnect);
                  props.client.sendText(props.message.from, view(results).TimesMorning);
                }

                props.client.sendText(props.message.from, `Seu cupom é ${coupon}`);
              });
            } else props.client.sendText(props.message.from, alert().TimeNotAvailable);
          } else if (ValidateHours(results, service_time)) {
            if (ValidateHours(results, indexHours(1))
              || ValidateHours(results, indexHours(-1))) {
              db.query(dualInsert, dualInsertValues(results), (errorInsert) => {
                if (errorInsert) {
                  props.client.sendText(props.message.from, alert().FailConnect);
                  props.client.sendText(props.message.from, view(results).TimesMorning);
                }

                props.client.sendText(props.message.from, `Seu cupom é ${coupon}`);
              });
            } else props.client.sendText(props.message.from, alert().TimeNotAvailable);
          } else props.client.sendText(props.message.from, alert().TimeNotAvailable);
        } else {
          props.client.sendText(props.message.from, alert().InvalidTextFormat);
          props.client.sendText(props.message.from, view(results).TimesMorning);
        }
      });
      break;
  }
}

// .replace(/(\/)|(\s)/g, '_').toLowerCase() || Aaaa e Aaaa/Aaaa >>  aaaa_a_aaaa ||;
