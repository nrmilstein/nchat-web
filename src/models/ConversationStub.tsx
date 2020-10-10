import User from "./User";
import Message from "./Message";

export default interface ConversationStub {
  id: number,
  conversationPartner: User,
}