import type { TypesViews } from '../models/interfaces';

// import { status } from '../global/status';
import { view } from '../messages/views';

export async function NameView(props: TypesViews) {
  const { status } = props;

  if (status[`NAME${props.message.sender.id}`.split('@')[0]] === '' || !status[`VIEW${props.message.sender.id}`.split('@')[0]]) {
    await props.client
      .sendText(props.message.from, view(props).NameView).then(() => {
        status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      });
  }
}
