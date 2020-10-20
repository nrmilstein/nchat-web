export default interface Message {
  id: number,
  senderId: number,
  body: string
  sent: Date,
}

export interface MessageNode extends Message {
  conversationId: number,
}