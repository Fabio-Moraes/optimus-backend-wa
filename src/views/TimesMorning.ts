import { GenerateCoupon } from '../components/GenerateCoupon';
import type { TypesViews } from '../models/interfaces';
import { AddLeadingZeros } from '../components/AddLeadingZeros';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';
import { db } from '../database/connect';

const hours = [
  '12:00:00',
  '11:30:00',
  '11:00:00',
  '10:30:00',
  '10:00:00',
  '09:30:00',
  '09:00:00',
  '08:30:00',
  '08:00:00',
  '07:30:00'];

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
  const service = status.service.replace(/(\/)|(\s)/g, '_').toLowerCase();
  const coupon = GenerateCoupon(4);
  const service_date = status.data.replace(/\//g, '-');
  const service_time = inputHours.join(':');

  const insert_values = [business, name, phone, service, coupon, service_date, service_time];
  const insert = 'INSERT INTO optimus SET business = ?, name = ?, phone = ?, service = ?, coupon = ?, service_date = ?, service_time = ?;';

  const select_values = [business, service_date];
  const select = 'SELECT service_time FROM optimus WHERE business = ? AND service_date = ?';

  switch (props.message.body.toLowerCase()) {
    case '#inicio':
      status.view = 'Main';
      await props.client
        .sendText(props.message.from, view().Main);
      break;

    case '#voltar':
      status.view = 'WhichPeriod';
      await props.client
        .sendText(props.message.from, view().WhichPeriod);
      break;

    default:
      if (hours.includes(inputHours.join(':'))) {
        db.query(select, select_values, (error, results) => {
          if (error) {
            // res.send(error);
            props.client
              .sendText(props.message.from, view().TimesMorning);
          }

          if (results?.filter((item: { service_time: String }) => (
            item.service_time === service_time)).length === 0) {
            db.query(insert, insert_values, (error2) => {
              if (error2) {
                props.client
                  .sendText(props.message.from, `${error2.message}`);
                props.client
                  .sendText(props.message.from, view().TimesMorning);
              }

              props.client
                .sendText(props.message.from, `Seu cupom é ${coupon}.`);
            });
          } else {
            props.client
              .sendText(props.message.from, 'Esse horário ja foi agendado');
          }
        });
      } else {
        await props.client
          .sendText(props.message.from, alert().InvalidTextFormat);
        await props.client
          .sendText(props.message.from, view().TimesMorning);
      }
      break;
  }
}
