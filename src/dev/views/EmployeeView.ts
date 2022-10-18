import type { TypesViews, TypesSession } from '../models/interfaces';
import { CleanStatus } from '../components/CleanStatus';

import { alert } from '../messages/alerts';
import { view } from '../messages/views';

import sessionJson from '../config/Session.json';

export async function EmployeeView(props: TypesViews) {
  const session: TypesSession = JSON.parse(JSON.stringify(sessionJson));
  const { status } = props;

  switch (props.message.body.toLowerCase()) {
    case '1':
      status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]] = session.Employee1;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DateView';
      await props.client
        .sendText(props.message.from, view(props).DateView);
      break;

    case '2':
      status[`EMPLOYEE${props.message.sender.id}`.split('@')[0]] = session.Employee2;
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'DateView';
      await props.client
        .sendText(props.message.from, view(props).DateView);
      break;

    case '#inicio':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'MainView';
      await props.client
        .sendText(props.message.from, view(props).MainView);
      break;

    case '#voltar':
      status[`VIEW${props.message.sender.id}`.split('@')[0]] = 'ServicesView';
      await props.client
        .sendText(props.message.from, view(props).DateView);
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
        .sendText(props.message.from, view(props).EmployeeView);
      break;
  }
}
