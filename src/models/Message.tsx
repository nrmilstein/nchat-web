export interface Message {
  uuid: string,
  id: number | null,
  senderId: number,
  body: string
  sent: Date | null,
}

export interface SyncedMessage extends Message {
  uuid: string,
  id: number,
  senderId: number,
  body: string
  sent: Date,
}