import User from "./User";
import Message from "./Message";

export default interface Conversation {
  id: number,
  users: User[],
  messages: Message[],
}