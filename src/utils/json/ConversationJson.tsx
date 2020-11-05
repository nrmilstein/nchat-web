import { MessageJson } from "./MessageJson";
import { UserJson } from "./UserJson";

export interface ConversationJson {
  id: number,
  conversationPartner: UserJson,
  messages: MessageJson[],
}