import { GEMS_REWARDS } from "~/utils";

const Toast = ({ setShowToast }: { setShowToast: (show: boolean) => void }) => {
  return (
    <div
      className="rounded-lg bg-white py-2 px-4 text-3xl shadow-xl"
      onClick={() => setShowToast(false)}
    >
      {"💎 ".repeat(GEMS_REWARDS.MESSAGE)}
    </div>
  );
};

export default Toast;
