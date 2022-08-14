import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { view } from '../messages/views';

export async function NameView(props: TypesViews) {
  if (status.view === 'NameView') {
    await props.client
      .sendText(props.message.from, view().NameView).then(() => {
        status.view = 'MainView';
      });
  }
}
