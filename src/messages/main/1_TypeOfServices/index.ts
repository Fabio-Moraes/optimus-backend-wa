import { Client } from "@open-wa/wa-automate";
import { variables } from "../../../variables";

import { msgTypeOfServices, msgAlert } from "./message";
import { msgMoreTypesOfService } from "./4_MoreTypesOfService/message";
import { msgMain } from "../../main/message";

export async function TypeOfServices(client: Client) {
  client.onMessage(async (message) => {
    if (variables.screen === "typeOfServices") {
      switch (message.body.toLowerCase()) {
        case "1":
          break;

        case "2":
          break;

        case "3":
          break;

        case "4":
          await client
            .sendText(message.from, msgMoreTypesOfService)
            .then(() => (variables.screen = "moreTypesOfService"));
          break;

        case "0":
          await client
            .sendText(message.from, msgMain)
            .then(() => (variables.screen = "main"));
          break;

        default:
          await client.sendText(message.from, msgAlert);
          await client.sendText(message.from, msgTypeOfServices);
          break;
      }
    }
  });
}
