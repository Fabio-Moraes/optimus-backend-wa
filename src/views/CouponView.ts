import type { TypesViews } from '../models/interfaces';

// import { status } from '../global/status';
import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function CouponView(props: TypesViews) {
  const { status } = props;

  switch (props.message.body.toLowerCase()) {
    case '1':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
      await props.client
        .sendText(props.message.from, view(props).ServicesView);
      break;

    case '2':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'NameView';
      await props.client
        .sendText(props.message.from, alert().Finished);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view(props).CouponView);
      break;
  }
}
