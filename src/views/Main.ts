import { TypesViews } from "../global/interfaces";
import { status } from "../global/status";
import { view } from "../messages/views";

export async function Main(props: TypesViews) {
  switch (props.message.body.toLowerCase()) {
    case "1":
      await props.client
        .sendText(props.message.from, view.TypesOfServices)
        .then(() => (status.view = "TypesOfServices"));

      break;

    case "2":
      break;

    case "3":
      break;

    case "0":
      await props.client.sendContact(
        props.message.sender.id,
        "554192626733@c.us"
      );
      break;

    default:
      await props.client.sendText(props.message.from, view.Main);
      break;
  }
}
