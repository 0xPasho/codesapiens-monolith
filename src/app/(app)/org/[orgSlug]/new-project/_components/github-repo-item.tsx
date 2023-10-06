const SelectPickerOrgItem = ({
  isSelected,
  name,
  avatar,
  onClick,
}: {
  isSelected: boolean;
  name: string;
  avatar?: string;
  onClick: (org: string) => void;
}) => {
  return (
    <li>
      <button
        type="button"
        className="inline-flex w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-600 hover:text-white"
        onClick={() => {
          onClick(name);
        }}
      >
        <div className="inline-flex items-center">
          {avatar ? (
            <div>
              <img className="mr-2 h-6 w-6 rounded-full" src={avatar} />
            </div>
          ) : null}
          <span className={`${isSelected ? "text-main-10 font-bold" : ""}`}>
            {name}
          </span>
        </div>
      </button>
    </li>
  );
};

export { SelectPickerOrgItem };
