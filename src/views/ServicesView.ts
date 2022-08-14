import type { TypesViews } from '../models/interfaces';
import 'dotenv/config';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function ServicesView(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case '1':
      status.service = process.env.ONESERVICE;
      status.view = 'DateView';
      await props.client
        .sendText(props.message.from, view().DateView);
      break;

    case '2':
      status.service = process.env.TWOSERVICE;
      status.view = 'DateView';
      await props.client
        .sendText(props.message.from, view().DateView);
      break;

    case '3':
      status.service = process.env.THREESERVICE;
      status.view = 'DateView';
      await props.client
        .sendText(props.message.from, view().DateView);
      break;

    case '4':
      status.service = process.env.OTRERSERVICE;
      await props.client
        .sendText(props.message.from, view().DateView)
        .then(() => {
          status.view = 'DateView';
        });
      break;

    case '#inicio':
      status.view = 'MainView';
      await props.client
        .sendText(props.message.from, view().MainView);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view().ServicesView);
      break;
  }
}
