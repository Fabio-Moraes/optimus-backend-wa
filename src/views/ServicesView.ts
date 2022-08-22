import type { TypesViews } from '../models/interfaces';
import { CleanStatus } from '../components/CleanStatus';
import 'dotenv/config';

import { alert } from '../messages/alerts';
import { view } from '../messages/views';

export async function ServicesView(props: TypesViews) {
  const { status } = props;

  switch (props.message.body.toLowerCase()) {
    case '1':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = process.env.ONESERVICE;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
      await props.client
        .sendText(props.message.from, view(props).EmployeeView);
      break;

    case '2':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = process.env.TWOSERVICE;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
      await props.client
        .sendText(props.message.from, view(props).EmployeeView);
      break;

    case '3':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = process.env.THREESERVICE;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
      await props.client
        .sendText(props.message.from, view(props).EmployeeView);
      break;

    case '4':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = process.env.OTRERSERVICE;
      await props.client
        .sendText(props.message.from, view(props).EmployeeView)
        .then(() => {
          status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
        });
      break;

    case '#inicio':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      await props.client
        .sendText(props.message.from, view(props).MainView);
      break;

    case '#sair':
      status[`NAME${props.message.sender.id}`.split('@')[0]] = '';
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = '';
      CleanStatus(props);
      await props.client
        .sendText(props.message.from, alert().Cancel);
      break;

    default:
      await props.client
        .sendText(props.message.from, alert().OptionsBelow);
      await props.client
        .sendText(props.message.from, view(props).ServicesView);
      break;
  }
}
