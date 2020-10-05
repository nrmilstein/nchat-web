import User from "./User";
import Message from "./Message";

export default interface Conversation {
  id: number,
  users: Array<User>,
  messages: Array<Message>,
}