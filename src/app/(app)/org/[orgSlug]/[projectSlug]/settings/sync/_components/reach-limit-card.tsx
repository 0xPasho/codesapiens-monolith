import CardDataModifier from "~/app/(app)/account/_components/card-data-modifier";

const ReachLimitCard = ({ orgSlug, projectSlug }) => {
  return (
    <CardDataModifier
      title="Questions and Files generation Usage"
      description={
        <>
          <span>
            When limit is reached, you can't generate more questions or files.
          </span>
        </>
      }
      content={""}
    />
  );
};

export default ReachLimitCard;
