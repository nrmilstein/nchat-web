import User from "./User";
import Message from "./Message";

export default interface Conversation {
  id: number,
  created: Date,
  users: Array<User>,
  messages: Array<Message>,
}