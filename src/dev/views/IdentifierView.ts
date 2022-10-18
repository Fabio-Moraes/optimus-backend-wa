import type { TypesViews } from '../models/interfaces';
import { CleanStatus } from '../components/CleanStatus';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function IdentifierView(props: TypesViews) {
  const { status } = props;

  switch (props.message.body.toLowerCase()) {
    case '1':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
      await props.client
        .sendText(props.message.from, view(props).ServicesView);
      break;

    case '2':
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
      CleanStatus(props);
      await props.client
        .sendText(props.message.from, alert().Finished);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view(props).IdentifierView);
      break;
  }
}
