import type { TypesViews } from '../models/interfaces';
import { status } from '../global/status';
import { view } from '../messages/views';

export async function Test(props: TypesViews) {
  switch (props.message.body.toLocaleLowerCase()) {
    case 'asd':
      break;

    default:
      if (status.name === '') status.name = props.message.body;
      await props.client.sendText(props.message.from, view().MainView);
      break;
  }
}
