import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function CouponView(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case '1':
      break;

    case '2':
      break;

    case '#inicio':
      status.view = 'MainView';
      await props.client
        .sendText(props.message.from, view().MainView);
      break;

    case '#voltar':
      status.view = 'DateView';
      await props.client
        .sendText(props.message.from, view().DateView);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view().CouponView);
      break;
  }
}
