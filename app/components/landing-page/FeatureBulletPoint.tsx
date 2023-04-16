import { IconType } from "react-icons";
import IconWrapper from "./IconWrapper";

const FeatureBulletPoint = ({
  Icon,
  hideFill,
  title,
  paragraph,
}: {
  Icon?: IconType;
  hideFill?: boolean;
  title: string;
  paragraph?: string;
}) => {
  return (
    <div className="flex gap-2">
      {Icon && (
        <IconWrapper
          Icon={() => (
            <Icon
              size={30}
              className={`${hideFill ? "" : "fill-blue-800"} stroke-blue-800`}
            />
          )}
        />
      )}
      <div className="flex flex-1 flex-col justify-start gap-2">
        <h4 className="text-lg font-bold">{title}</h4>
        <p>{paragraph}</p>
      </div>
    </div>
  );
};

export default FeatureBulletPoint;
