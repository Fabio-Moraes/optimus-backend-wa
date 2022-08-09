import type { TypesViews } from '../models/interfaces';

import { status } from '../global/status';
import { view } from '../messages/views';

export async function SelectedName(props: TypesViews) {
  if (status.view === 'SelectedName') {
    await props.client
      .sendText(props.message.from, view().SelectedName).then(() => {
        status.view = 'Main';
      });
  }
}
