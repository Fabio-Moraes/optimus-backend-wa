import moment from 'moment';
import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

function parseDate(input: string) {
  const regexExp = /^(0?[1-9]|[12][0-9]|3[01])(\/)(0?[1-9]|1[012])(\/)(\d{4}|\d{2})$/gi;
  return regexExp.test(input) ? input.split('/') : ['00', '00', '00'];
}

function addZero(value: string | number) {
  return `0${value}`.toString().slice(-2);
}

export async function SelectedData(props: TypesViews) {
  const split = parseDate(props.message.body);
  const oneDay = (1000 * 60 * 60 * 24);
  const date = new Date();

  const now = [date.getFullYear(), addZero(date.getMonth() + 1), addZero(date.getDate())];
  const input = [`20${split[2].toString().slice(-2)}`, addZero(split[1]), addZero(split[0])];

  const getLimiter = new Date((date.getTime() + (oneDay * 14)));
  const getInput = new Date(input.join('/'));
  const getNow = new Date(now.join('/'));

  switch (props.message.body.toLowerCase()) {
    case '#inicio':
      status.view = 'Main';
      await props.client
        .sendText(props.message.from, view().Main);
      break;

    case '#voltar':
      status.view = 'TypesOfServices';
      await props.client
        .sendText(props.message.from, view().TypesOfServices);
      break;

    default:
      if (moment(input.join('/'), 'YYYY/MM/DD', true).isValid()) {
        if (getInput.getTime() <= getLimiter.getTime()
          && getInput.getTime() >= getNow.getTime()) {
          status.data = input.join('/');
          status.view = 'WhichPeriod';
          await props.client
            .sendText(props.message.from, view().WhichPeriod);
        } else {
          await props.client
            .sendText(props.message.from, alert().InvalidDate);
          await props.client
            .sendText(props.message.from, view().SelectedData);
        }
      } else {
        await props.client
          .sendText(props.message.from, alert().InvalidTextFormat);
        await props.client
          .sendText(props.message.from, view().SelectedData);
      }
      break;
  }
}
