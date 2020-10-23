import { User, SyncedUser, UnsyncedUser } from "./User";
import { Message } from "./Message";

export interface ConversationStub {
  uuid: string,
  id: number | null,
  conversationPartner: SyncedUser,
}

export interface Conversation {
  uuid: string,
  id: number | null,
  conversationPartner: User,
  messages: Message[],
  isEditable: boolean,
}

export interface UnsyncedConversation extends Conversation {
  uuid: string,
  id: number | null,
  conversationPartner: UnsyncedUser,
  messages: Message[],
  isEditable: false,
}

export interface SyncedConversation extends UnsyncedConversation {
  uuid: string,
  id: number,
  conversationPartner: SyncedUser,
  messages: Message[],
  isEditable: false,
}