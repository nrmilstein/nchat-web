export interface Message {
  uuid: string,
  id: number | null,
  senderId: number,
  body: string
  sent: Date | null,
}
