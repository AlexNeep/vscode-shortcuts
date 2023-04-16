import { Link } from "@remix-run/react";
import { IoIosRocket } from "react-icons/io";
import Button from "../core/Buttons";

type LinkProps = {
  setMenuOpen?: (value: boolean) => void;
  hideButton?: boolean;
  fullWidth?: boolean;

  iconSize?: number;
};

export const PremiumLink = ({
  setMenuOpen = () => {},
  fullWidth,
  iconSize = 24,
}: LinkProps) => {
  return (
    <Link to="/pricing" onClick={() => setMenuOpen(false)}>
      <Button variant="hypercolour">
        <div
          className={`mx-auto flex ${
            fullWidth ? "w-full" : "w-2/3"
          } items-center justify-between gap-2`}
        >
          Go Premium
          <IoIosRocket size={iconSize} />
        </div>
      </Button>
    </Link>
  );
};
