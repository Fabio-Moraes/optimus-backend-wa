import type { Client, ChatId, Contact } from '@open-wa/wa-automate';

export interface TypesSession {
  Business: string;
  Oneservice: string;
  Twoservice: string;
  Threeservice: string;
  Otrerservice: string;
  Employee1: string;
  Employee2: string;
  Afternoon: string;
  Morning: string;
}

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
