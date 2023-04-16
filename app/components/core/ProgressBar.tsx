import * as RadixProgress from "@radix-ui/react-progress";
import { AiOutlineCheckCircle } from "react-icons/ai";

const ProgressBar = ({
  steps,
  completedSteps,
}: {
  steps: number;
  completedSteps: number;
}) => {
  const progress = (100 * completedSteps) / steps;

  return (
    <RadixProgress.Root
      className="relative h-full w-full overflow-hidden rounded-full bg-white shadow"
      style={{
        transform: "translateZ(0)",
      }}
      value={progress}
    >
      {new Array(steps).fill(1).map((_, index) => (
        <RadixProgress.Indicator
          key={index}
          className={`absolute z-20 h-full w-full border-r
          ${index < completedSteps ? "border-purple-500" : "border-gray-200"}`}
          style={{ transform: `translateX(-${100 - (100 / steps) * index}%)` }}
        />
      ))}

      <RadixProgress.Indicator
        className="h-full w-full bg-purple-400 shadow-inner"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </RadixProgress.Root>
  );
};

export default ProgressBar;
