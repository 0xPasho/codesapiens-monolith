import { Document } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Context,
} from "react";

// Define the state shape and the actions available in the context
interface WikiContextType {
  menuItems: Document[];
  setMenuItems: React.Dispatch<React.SetStateAction<Document[]>>;
  currentSelectedMenuItem?: Document;
  setCurrentSelectedMenuItem: React.Dispatch<
    React.SetStateAction<Document | undefined>
  >;
  reset: () => void;
  updateLeafById: (id: string, updatedLeaf: Document[]) => void;
}

// Create the Context with a default undefined value and a specific type
const WikiContext: Context<WikiContextType | undefined> = createContext<
  WikiContextType | undefined
>(undefined);

// Custom hook for easier usage of the context
export const useWikiContext = (): WikiContextType => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error("useWikiContext must be used within a WikiProvider");
  }
  return context;
};

interface WikiProviderProps {
  children: ReactNode;
}

// Provider component
export const WikiProvider: React.FC<WikiProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<Document[]>([]);
  const [currentSelectedMenuItem, setCurrentSelectedMenuItem] = useState<
    Document | undefined
  >();

  // Function to reset to initial state
  const reset = () => {
    setMenuItems([]);
    setCurrentSelectedMenuItem(undefined);
  };

  const updateNestedLeaf = (
    items: Document[],
    id: string,
    updatedLeaf: Document[],
  ): Document[] => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, children: updatedLeaf };
      }
      if (item.children) {
        return {
          ...item,
          children: updateNestedLeaf(item.children, id, updatedLeaf),
        };
      }
      return item;
    });
  };

  const updateLeafById = (id: string, updatedLeaf: Document[]) => {
    const updatedMenuItems = updateNestedLeaf(menuItems, id, updatedLeaf);
    setMenuItems(updatedMenuItems);
  };

  const value: WikiContextType = {
    menuItems,
    setMenuItems,
    currentSelectedMenuItem,
    setCurrentSelectedMenuItem,
    reset,
    updateLeafById,
  };

  return <WikiContext.Provider value={value}>{children}</WikiContext.Provider>;
};
