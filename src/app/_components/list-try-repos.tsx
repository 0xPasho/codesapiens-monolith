import { Badge } from "@/components/ui/badge";
import tryReposData, { LandingPageRepositoryInfo } from "./try-repos-data";

const ListItem = ({ item }: { item: LandingPageRepositoryInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          alt="Project logo"
          className="h-8 w-8 rounded-full"
          height="32"
          src="/placeholder.svg"
          style={{
            aspectRatio: "32/32",
            objectFit: "cover",
          }}
          width="32"
        />
        <div className="pr-2">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-400">{item.description}</p>
        </div>
      </div>
      <Badge variant="secondary">{item.stars}</Badge>
    </div>
  );
};
const ListTryRepos = () => {
  return (
    <div className="h-[calc(100vh-200px)] space-y-6">
      {tryReposData.map((item) => (
        <ListItem item={item} />
      ))}
    </div>
  );
};

export default ListTryRepos;
