import { User } from "./User";
import { Message } from "./Message";

export interface ConversationStub {
  uuid: string,
  id: number | null,
  conversationPartner: User,
}

export interface Conversation {
  uuid: string,
  id: number,
  conversationStub: ConversationStub,
  conversationPartner: User,
  messages: Message[],
}