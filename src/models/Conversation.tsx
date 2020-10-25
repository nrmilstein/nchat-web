import { User } from "./User";
import { Message } from "./Message";

export interface Conversation {
  uuid: string,
  id: number | null,
  conversationPartner: User,
  messages: Message[],
  isHistoryLoaded: boolean,
  isLoading: boolean,
}