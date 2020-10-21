import { User } from "./User";
import { Message } from "./Message";

export interface ConversationStub {
  uuid: string,
  id: number | null,
  conversationPartner: User,
}

export interface Conversation {
  editable: boolean,
  uuid: string,
  id: number | null,
  conversationPartner: User,
  messages: Message[],
}