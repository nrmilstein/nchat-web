import { User } from "../../models/User";
import { MessageJson } from "./MessageJson";

export interface ConversationJson {
  id: number,
  conversationPartner: User,
  messages: MessageJson[],
}

export interface ConversationStubJson {
  id: number,
  conversationPartner: User,
}