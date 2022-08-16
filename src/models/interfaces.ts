import type { Client, ChatId, Contact } from '@open-wa/wa-automate';

export interface TypesViews {
  client: Client;
  message: {
    from: ChatId;
    sender: Contact;
    body: string;
  };
  status: {
    [k: string]: string
  }
}
