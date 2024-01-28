import { SocialsEditComponent } from "../_components/SocialsEditComponent";
import useReadmeStore from "../_utils/readme-context";

const useEditReadmeContent = () => {
  const { items, currentlyEditingItemIndex } = useReadmeStore();
  const foundItem = items[currentlyEditingItemIndex];

  switch (foundItem.type) {
    case "general":
      return { title: "General information", component: <div></div> };
    case "your-socials":
      return {
        title: "What are your socials?",
        component: <SocialsEditComponent />,
      };
    case "key-info-as-code":
      return { title: "Your key information in code", component: <></> };
    case "profile-view-counter":
      return {
        title: "Your profile view counter",
        component: (
          <>
            <span>This is how it will look like</span>
          </>
        ),
      };
    case "github-stats-card":
      return { title: "Your github stats card" };
  }
};

export { useEditReadmeContent };
