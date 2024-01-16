import { Badge } from "@/components/ui/badge";
import { LandingPageRepositoryInfo, tryReposData } from "./try-repos-data";
import clsx from "clsx";
import { GithubIcon, ListIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Link1Icon } from "@radix-ui/react-icons";

const ListItem = ({
  item,
  onSelect,
  isSelected,
}: {
  item: LandingPageRepositoryInfo;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const convertedNumber = Math.floor(parseInt(item.stars, 16) || 0);
  let formattedNumber = parseFloat((convertedNumber / 1000).toFixed(1));
  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-lg border border-2 px-4  py-2 hover:cursor-pointer",
        isSelected ? "border-primary" : "",
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-4">
        <img
          alt="Project logo"
          className="h-8 w-8 rounded-full"
          height="32"
          src={item.image}
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
      <div className="flex flex-col">
        <Badge variant="secondary" className="px-2 text-yellow-500">
          <StarIcon className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
          {formattedNumber.toLocaleString()}k
        </Badge>
        <Link target="blank" href={item.github_url}>
          <Badge
            variant="outline"
            className="mt-1 w-full items-center justify-center px-1 text-center text-yellow-500"
          >
            <GithubIcon className="mr-1 h-3 w-3" /> More
          </Badge>
        </Link>
      </div>
    </div>
  );
};
const ListTryRepos = ({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) => {
  const [showListRepos, setShowListRepos] = useState(false);
  const mobileItem = tryReposData[selected];
  const allListItems = tryReposData.map((item, index) => (
    <ListItem
      item={item}
      isSelected={index === selected}
      onSelect={() => {
        onSelect(index);
        if (showListRepos) {
          setShowListRepos(false);
        }
      }}
    />
  ));
  return (
    <>
      <div className="md:hidden">
        {showListRepos ? (
          <>
            <h1 className="px-4 text-center font-bold">Select a repository</h1>
            {allListItems}
          </>
        ) : (
          <>
            <h1 className="mb-2 text-center font-bold">
              CURRENT SELECTED REPOSITORY
            </h1>
            <ListItem item={mobileItem} isSelected onSelect={() => {}} />
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => {
                  setShowListRepos(true);
                }}
                variant="secondary"
              >
                <ListIcon className="mr-1.5 h-4 w-4" /> Change to other
                repository
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="hidden h-[calc(100vh-200px)] space-y-6 px-2 md:block">
        {allListItems}
      </div>
    </>
  );
};

export default ListTryRepos;
