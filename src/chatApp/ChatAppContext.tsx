import React from "react";
import { User } from "../models/User";

interface ChatAppContextType {
  authKey: string,
  user: User,
}

export const ChatAppContext = React.createContext<ChatAppContextType>({
  authKey: "",
  user: {
    id: -1,
    name: "",
    username: ""
  },
});
