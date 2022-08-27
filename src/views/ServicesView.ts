import type { TypesViews, TypesSession } from '../models/interfaces';
import { CleanStatus } from '../components/CleanStatus';

import { alert } from '../messages/alerts';
import { view } from '../messages/views';

import sessionJson from '../config/Session.json';

export async function ServicesView(props: TypesViews) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  switch (props.message.body.toLowerCase()) {
    case '1':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Oneservice;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
      await props.client
        .sendText(props.message.from, view(props).EmployeeView);
      break;

    case '2':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Twoservice;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
      await props.client
        .sendText(props.message.from, view(props).EmployeeView);
      break;

    case '3':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Threeservice;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'EmployeeView';
      await props.client
        .sendText(props.message.from, view(props).EmployeeView);
      break;

    case '4':
      status[`SERVICE${props.message.sender.id}`.split('@')[0]] = session.Otrerservice;
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
