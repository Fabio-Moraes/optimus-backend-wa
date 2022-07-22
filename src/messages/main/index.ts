import { Client } from "@open-wa/wa-automate";
import { variables } from "../../variables";

import { msgTypeOfServices } from "./1_TypeOfServices/message";
import { msgMain } from "./message";

export function Main(client: Client) {
  client.onMessage(async (message) => {
    if (variables.screen === "main") {
      switch (message.body.toLowerCase()) {
        case "1":
          await client
            .sendText(message.from, msgTypeOfServices)
            .then(() => (variables.screen = "typeOfServices"));

          break;

        case "2":
          break;

        case "3":
          break;

        case "0":
          await client.sendContact(message.sender.id, "554192626733@c.us");
          break;

        default:
          await client.sendText(message.from, msgMain);
          break;
      }
    }
  });
}
