import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { view } from '../messages/views';
import { Test } from '../views/Test';

export async function Main(props: TypesViews) {
  switch (props.message.body.toLocaleLowerCase()) {
    case '1':
      status.view = 'TypesOfServices';
      await props.client
        .sendText(props.message.from, view().TypesOfServices);
      break;

    case '2':
      break;

    case '3':
      break;

    case '4':
      break;

    case '0':
      await props.client
        .sendContact(props.message.sender.id, '554192626733@c.us');
      break;

    case '#perfil':
      status.view = 'Main';
      status.name = '';
      await props.client
        .sendText(props.message.from, view().SelectedName);
      break;

    default:
      // if (status.name === '') status.name = props.message.body;
      // await props.client.sendText(props.message.from, view().Main);
      Test(props);
      break;
  }
}
