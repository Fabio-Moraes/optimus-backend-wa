import type { TypesViews } from '../models/interfaces';

// import { status } from '../global/status';
import { view } from '../messages/views';
import { Test } from '../views/TestView';

export async function MainView(props: TypesViews) {
  const { status } = props;
  switch (props.message.body.toLocaleLowerCase()) {
    case '1':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
      await props.client
        .sendText(props.message.from, view(props).ServicesView);
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
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      await props.client
        .sendText(props.message.from, view(props).NameView);
      break;

    default:
      // if (status.name === '') status.name = props.message.body;
      // await props.client.sendText(props.message.from, view().MainView);
      Test(props);
      break;
  }
}
