import {
  create,
  Client,
  NotificationLanguage,
  ChatId,
} from "@open-wa/wa-automate";

export class _draft {
  constructor() {
    this.initialize();
  }

  private initialize() {
    create({
      sessionId: "Optimus_Prime",
      multiDevice: true,
      authTimeout: 60,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: NotificationLanguage.PTBR,
      logConsole: false,
      popup: true,
      qrTimeout: 0,
    }).then((client) => start(client));

    function start(client: Client) {
      client.onMessage(async (message) => {
        console.log(message.body);

        switch (message.body.toLowerCase()) {
          case "oi":
            await client.sendText(message.from, "🤖 Oi!");
            await client.sendText(
              message.from,
              "Eu sou Optimus Prime, Líder dos Autobots, eu fui criado em Cybertron e sou um Transformer."
            );
            break;

          case "camelos":
            await client.sendText(
              message.from,
              "🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫🐫"
            );
            break;

          case "teste":
            await client.sendText(message.from, "estou vivo");
            break;

          case "james":
            await client.sendContact(message.sender.id, "554192626733@c.us");
            break;

          case "koba":
            await client.sendImage(
              message.sender.id,
              "https://legpzytiaeepvlgmekfk.supabase.co/storage/v1/object/public/optimus-prime/koba.png",
              "koba.png",
              "🐒🐒🐒🐒🐒🐒"
            );
            await client.sendText(message.from, "🤣🤣🤣🤣🤣🤣");
            break;

          case "ago":
            await client.sendImage(
              message.sender.id,
              "https://legpzytiaeepvlgmekfk.supabase.co/storage/v1/object/public/optimus-prime/ago.png",
              "ago.png",
              "Thiago ventila vaca kkkkkk"
            );
            break;

          case "kaique":
            await client.sendText(message.from, "mano juritex");
            break;

          default:
            await client.sendText(
              message.from,
              `Essas são as palavras que intendo 💬
            
            oi
            camelos
            teste
            koba
            ago
            kaique
            `
            );
            break;
        }
      });
    }
  }
}
