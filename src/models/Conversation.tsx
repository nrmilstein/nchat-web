import User from "./User";
import Message from "./Message";

export interface ConversationStub {
  id: number,
  conversationPartner: User,
}

export default interface Conversation extends ConversationStub {
  messages: Message[],
}