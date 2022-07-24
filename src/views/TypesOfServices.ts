import type { TypesViews } from '../models/interfaces';
import { status } from '../global/status';

import { view } from '../messages/views';
import { alert } from '../messages/alerts';

export async function TypesOfServices(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case '1':
      break;

    case '2':
      break;

    case '3':
      break;

    case '4':
      await props.client
        .sendText(props.message.from, view.MoreTypesOfService)
        .then(() => { status.view = 'MoreTypesOfServices'; });
      break;

    case '0':
      await props.client
        .sendText(props.message.from, view.Main)
        .then(() => { status.view = 'Main'; });
      break;

    default:
      await props.client.sendText(props.message.from, alert.OptionsBelow);
      await props.client.sendText(props.message.from, view.TypesOfServices);
      break;
  }
}
