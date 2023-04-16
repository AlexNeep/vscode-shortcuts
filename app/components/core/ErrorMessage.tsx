import { BiErrorCircle } from "react-icons/bi";

type ErrorMessageProps = { error: string };

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return (
    <p className="flex items-center justify-start gap-2 rounded bg-red-200 px-4 py-2 font-semibold text-black shadow-md">
      <BiErrorCircle size="25" className="flex-shrink-0 fill-red-900" />
      {error}
    </p>
  );
};

export default ErrorMessage;
