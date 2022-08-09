import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function WhichPeriod(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case '1':
      break;

    case '2':
      status.view = 'TimesMorning';
      await props.client
        .sendText(props.message.from, view().TimesMorning);
      break;

    case '#inicio':
      status.view = 'Main';
      await props.client
        .sendText(props.message.from, view().Main);
      break;

    case '#voltar':
      status.view = 'SelectedData';
      await props.client
        .sendText(props.message.from, view().SelectedData);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view().WhichPeriod);
      break;
  }
}
