import { Client } from "@open-wa/wa-automate";
import { variables } from "../../../../variables";

import { msgMoreTypesOfService, msgAlert } from "./message";
import { msgMain } from "../../../main/message";

export async function MoreTypesOfService(client: Client) {
  client.onMessage(async (message) => {
    if (variables.screen === "moreTypesOfService") {
      switch (message.body.toLowerCase()) {
        case "1":
          break;

        case "2":
          break;

        case "3":
          break;

        case "0":
          await client
            .sendText(message.from, msgMain)
            .then(() => (variables.screen = "main"));
          break;

        default:
          await client.sendText(message.from, msgAlert);
          await client.sendText(message.from, msgMoreTypesOfService);
          break;
      }
    }
  });
}
