export interface User {
  id: number | null,
  email: string | null,
  name: string | null,
}

export interface UnsyncedUser {
  id: number | null,
  email: string,
  name: string | null,
}

export interface SyncedUser extends User {
  id: number,
  email: string,
  name: string,
}
