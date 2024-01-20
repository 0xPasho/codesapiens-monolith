import create from "zustand";
import { ChatHistory } from "@prisma/client";

export type ChatRepositoriesItems = {
  value: string;
  label: string;
  metadata?: {
    isSynced: boolean;
    hasDocuments: boolean;
  };
};

// Defining the Chat State Types
type ChatState = {
  messages: ChatHistory[];
  chatId: string;
  promptInput: string;
  currentStatus: "new" | "stale" | "error";
  isLoading: boolean;
  selectedRepositoriesItem: string;
  repositoriesItems: ChatRepositoriesItems[];
};

// Defining the Chat Store Actions and State
const useChatStore = create<
  ChatState & {
    addMessage: (message: ChatHistory) => void;
    setConversationHistory: (
      callback: (currMsgs: ChatHistory[]) => ChatHistory[],
    ) => void;
    setStatus: (status: ChatState["currentStatus"]) => void;
    setChatId: (id: string) => void;
    setPromptInput: (input: string) => void;
    setChatIsLoading: (isLoading: boolean) => void;
    setChatRepositories: (items: ChatRepositoriesItems[]) => void;
    setSelectedRepositoriesItem: (id: string) => void;
    reset: () => void;
    resetExceptRepositoryItems: () => void;
  }
>((set) => ({
  // Initial State
  messages: [],
  chatId: "",
  promptInput: "",
  currentStatus: "new",
  isLoading: false,
  selectedRepositoriesItem: "all",
  repositoriesItems: [{ value: "all", label: "All documents" }],

  // Actions
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setConversationHistory: (cb) =>
    set((state) => ({ messages: [...cb(state.messages)] })),
  setStatus: (status) => set(() => ({ currentStatus: status })),
  setChatId: (id) => set(() => ({ chatId: id })),
  setPromptInput: (input) => set(() => ({ promptInput: input })),
  setChatIsLoading: (isLoading) => set(() => ({ isLoading })),
  setSelectedRepositoriesItem: (id) => {
    set({ selectedRepositoriesItem: id });
  },
  setChatRepositories: (repositoriesItems) =>
    set(() => ({
      repositoriesItems,
    })),
  reset: () =>
    set(() => ({
      messages: [],
      chatId: "",
      currentStatus: "new",
      promptInput: "",
      isLoading: false,
      repositoriesItems: [{ value: "all", label: "All documents" }],
      selectedRepositoriesItem: "all",
    })),
  resetExceptRepositoryItems: () =>
    set(() => ({
      messages: [],
      chatId: "",
      currentStatus: "new",
      promptInput: "",
      isLoading: false,
    })),
}));

export default useChatStore;
