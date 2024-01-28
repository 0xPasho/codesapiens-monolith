import create from "zustand";

export type ReadmeItemType =
  | "general"
  | "your-socials"
  | "key-info-as-code"
  | "profile-view-counter"
  | "github-stats-card";

interface ReadmeItem {
  position: number;
  type: ReadmeItemType;
  data: any;
}

// Defining the Chat State Types
type ReadmeState = {
  items: ReadmeItem[];
  currentlyEditingItemIndex?: number;
  githubUsername?: string;
  componentsTheme: "dark" | "light";
};

// Defining the Chat Store Actions and State
const useReadmeStore = create<
  ReadmeState & {
    addItem: (item: ReadmeItem) => void;
    updateItemData: (itemData: any) => void;
    setCurrentlyEditingItemIndex: (index: number) => void;
    setGithubUsername: (newUsername: string) => void;
    setComponentsTheme: (theme: "dark" | "light") => void;
  }
>((set) => ({
  items: [],
  currentlyEditingItemIndex: -1,
  componentsTheme: "dark",
  githubUsername: undefined,
  setGithubUsername: (newUsername) => {
    set({ githubUsername: newUsername });
  },
  setComponentsTheme: (theme) => {
    set({ componentsTheme: theme });
  },
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  setCurrentlyEditingItemIndex: (currentlyEditingItemIndex) => {
    set({ currentlyEditingItemIndex });
  },
  moveItem: (direction: "up" | "down", movingIndex: number) => {
    set((state) => {
      let newItems = [...state.items];
      if (direction === "up") {
        const prevItem = {
          ...newItems[movingIndex - 1],
          position: movingIndex,
        };
        const movingItem = {
          ...newItems[movingIndex],
          position: movingIndex - 1,
        };
        newItems[movingIndex] = prevItem;
        newItems[movingIndex - 1] = movingItem;
      } else {
        const nextItem = {
          ...newItems[movingIndex + 1],
          position: movingIndex,
        };
        const movingItem = {
          ...newItems[movingIndex],
          position: movingIndex + 1,
        };
        newItems[movingIndex] = nextItem;
        newItems[movingIndex + 1] = movingItem;
      }
      return {
        ...state,
        items: newItems,
      };
    });
  },
  updateItemData: (itemData: any) => {
    set((state) => {
      let newItems = [...state.items];
      newItems[state.currentlyEditingItemIndex] = {
        ...newItems[state.currentlyEditingItemIndex],
        data: itemData,
      };
      return {
        ...state,
        items: newItems,
      };
    });
  },
}));

export default useReadmeStore;
