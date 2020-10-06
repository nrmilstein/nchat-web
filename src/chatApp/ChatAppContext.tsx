import React from "react";
import User from "../models/User";

interface ChatAppContextType {
  authKey: string,
  user: User | null,
}

export const ChatAppContext = React.createContext<ChatAppContextType>({
  authKey: "",
  user: null,
});
