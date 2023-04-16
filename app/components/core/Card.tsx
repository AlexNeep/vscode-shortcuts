type Width = "full" | "row";
enum Variant {}

const Card = ({
  children,
  padding,
  gap,
  width,
}: {
  children: JSX.Element | JSX.Element[];
  width: Width;
  gap?: "small";
  padding?: "small";
}) => {
  return (
    <div
      className={`flex w-full flex-auto flex-col justify-between  rounded-md bg-slate-200 shadow-lg ${
        width === "row" && " sm:w-1/3 md:w-1/4 xl:w-1/5"
      } ${padding === "small" ? "p-3" : "px-6 py-10"} ${
        gap === "small" ? "gap-4" : "gap-10"
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
