import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CustomGithubRepo = ({
  onSubmit,
  inputValue,
  setInputValue,
}: {
  onSubmit: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  if (!clicked) {
    return (
      <Button
        variant="link"
        onClick={() => {
          setClicked(true);
        }}
      >
        🔗 Add a public repository manually
      </Button>
    );
  }
  return (
    <div className="mb-6 flex flex-col md:flex-row">
      <Input
        placeholder="🔗 Paste here the link to the repository"
        autoFocus
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        type="url"
        required
        className="w-full"
        onKeyDown={(value) => {
          if (value.key === "Enter") {
            onSubmit();
          }
        }}
      />
      {inputValue ? (
        <Button className="min-w-[18rem] max-w-full" onClick={() => onSubmit()}>
          Add repo
        </Button>
      ) : null}
    </div>
  );
};

export default CustomGithubRepo;
