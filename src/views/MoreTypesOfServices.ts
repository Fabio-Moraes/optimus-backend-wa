import { TypesViews } from "../global/interfaces";
import { status } from "../global/status";

import { view } from "../messages/views";
import { alert } from "../messages/alerts";

export async function MoreTypesOfServices(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case "1":
      break;

    case "2":
      break;

    case "3":
      break;

    case "0":
      await props.client
        .sendText(props.message.from, view.Main)
        .then(() => (status.view = "Main"));
      break;

    default:
      await props.client.sendText(props.message.from, alert.OptionsBelow);
      await props.client.sendText(props.message.from, view.MoreTypesOfService);
      break;
  }
}
