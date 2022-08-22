import type { TypesViews } from '../models/interfaces';
import { view } from '../messages/views';
import { alert } from '../messages/alerts';

export async function Test(props: TypesViews) {
  const { status } = props;

  switch (props.message.body.toLocaleLowerCase()) {
    case 'test':
      await props.client.sendText(props.message.from, status[`USER${props.message.sender.id}`.split('@')[0]]);
      break;

    case 'finalizar':
      props.client.sendText(props.message.from, alert().Finished);
      break;

    default:
      if (status[`NAME${props.message.sender.id}`.split('@')[0]] === '' || !status[`NAME${props.message.sender.id}`.split('@')[0]]) status[`NAME${props.message.sender.id}`.split('@')[0]] = props.message.body;
      await props.client.sendText(props.message.from, view(props).MainView);
      break;
  }
}
