import React from "react";
import { SyncedUser } from "../models/User";

interface ChatAppContextType {
  authKey: string,
  user: SyncedUser,
}

export const ChatAppContext = React.createContext<ChatAppContextType>({
  authKey: "",
  user: {
    id: -1,
    name: "",
    email: ""
  },
});
