import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ChatHistory } from "@prisma/client";

type ChatState = {
  messages: ChatHistory[];
  chatId: string;
  promptInput: string;
  currentStatus: "new" | "stale" | "error";
  isLoading: boolean;
};

const EMPTY_STATE: ChatState = {
  messages: [],
  chatId: "",
  currentStatus: "new",
  promptInput: "",
  isLoading: false,
};

type ChatContextType = {
  state: ChatState;
  addMessage: (message: ChatHistory) => void;
  setConversationHistory: (history: ChatHistory[]) => void;
  setStatus: (status: ChatState["currentStatus"]) => void;
  setChatId: (id: string) => void;
  setPromptInput: (input: string) => void;
  setChatIsLoading: (isLoading: boolean) => void;
  reset: () => void;
};
type ChatAction =
  | { type: "ADD_MESSAGE"; payload: ChatHistory }
  | { type: "SET_STATUS"; payload: ChatState["currentStatus"] }
  | { type: "SET_CHAT_ID"; payload: string }
  | { type: "SET_PROMPT_INPUT"; payload: string }
  | { type: "SET_CHAT_LOADING"; payload: boolean }
  | {
      type: "SET_CONVERSATION_HISTORY";
      payload: ChatHistory[];
    }
  | { type: "RESET" };
const ChatContext = createContext<ChatContextType | undefined>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_STATUS":
      return { ...state, currentStatus: action.payload };
    case "SET_CHAT_ID":
      return { ...state, chatId: action.payload };
    case "SET_PROMPT_INPUT":
      return { ...state, promptInput: action.payload };
    case "SET_CHAT_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CONVERSATION_HISTORY":
      return { ...state, messages: action.payload };
    case "RESET":
      return EMPTY_STATE;
    default:
      return state;
  }
};

type ChatProviderProps = {
  children: ReactNode;
  initialChatId: string;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialChatId,
}) => {
  const initialState: ChatState = {
    ...EMPTY_STATE,
    chatId: initialChatId,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = (message: ChatHistory) => {
    dispatch({ type: "ADD_MESSAGE", payload: message });
  };

  const setStatus = (status: ChatState["currentStatus"]) => {
    dispatch({ type: "SET_STATUS", payload: status });
  };

  const setChatId = (id: string) => {
    dispatch({ type: "SET_CHAT_ID", payload: id });
  };

  const setPromptInput = (input: string) => {
    dispatch({ type: "SET_PROMPT_INPUT", payload: input });
  };

  const setChatIsLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_CHAT_LOADING", payload: isLoading });
  };

  const setConversationHistory = (history: ChatHistory[]) => {
    dispatch({ type: "SET_CONVERSATION_HISTORY", payload: history });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        addMessage,
        setStatus,
        setChatId,
        setPromptInput,
        setChatIsLoading,
        setConversationHistory,
        reset,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
