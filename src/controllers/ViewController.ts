import { Client } from "@open-wa/wa-automate";
import { status } from "@global/status";

import { MoreTypesOfServices } from "../views/MoreTypesOfServices";
import { TypesOfServices } from "../views/TypesOfServices";
import { Main } from "../views/Main";

export function ViewController(client: Client) {
  client.onMessage(async (message) => {
    switch (status.view) {
      case "Main":
        await Main({ client, message });
        break;

      case "TypesOfServices":
        await TypesOfServices({ client, message });
        break;

      case "MoreTypesOfServices":
        await MoreTypesOfServices({ client, message });
        break;

      default:
        break;
    }
  });
}
