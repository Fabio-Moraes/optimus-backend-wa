import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function TypesOfServices(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case '1':
      status.service = 'Corte de cabelo';
      status.view = 'SelectedData';
      await props.client
        .sendText(props.message.from, view().SelectedData);
      break;

    case '2':
      status.service = 'Barba/sobrancelha';
      status.view = 'SelectedData';
      await props.client
        .sendText(props.message.from, view().SelectedData);
      break;

    case '3':
      status.service = 'Cabelo e barba/sobrancelha';
      status.view = 'SelectedData';
      await props.client
        .sendText(props.message.from, view().SelectedData);
      break;

    case '4':
      status.service = 'Cerviços variados';
      await props.client
        .sendText(props.message.from, view().SelectedData)
        .then(() => {
          status.view = 'SelectedData';
        });
      break;

    case '#inicio':
      status.view = 'Main';
      await props.client
        .sendText(props.message.from, view().Main);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view().TypesOfServices);
      break;
  }
}
