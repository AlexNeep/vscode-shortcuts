import { AiOutlineEdit } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
const BulletPoint = ({
  point,
  excluded,
  bold,
}: {
  point: string;
  excluded?: boolean;
  bold?: boolean;
}) => {
  return (
    <p
      className={`flex items-center justify-start gap-4 text-left ${
        excluded ? "text-slate-400" : "text-slate-700"
      } ${bold ? "font-semibold" : "font-normal"}`}
    >
      {excluded ? (
        <BiPlus size={25} className="rotate-45 text-red-400" />
      ) : (
        <AiOutlineEdit size={25} className="fill-blue-500" />
      )}
      {point}
    </p>
  );
};

export default BulletPoint;
