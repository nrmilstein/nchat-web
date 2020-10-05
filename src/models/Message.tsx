import Conversation from "./Conversation"
import User from "./User";

export default interface Message {
  id: number,
  user: User,
  sent: Date,
  body: string
}