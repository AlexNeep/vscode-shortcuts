import { useTransition } from "@remix-run/react";
import { useState } from "react";

export enum ButtonPaddingOptions {
  SMALL = "py-2 lg:py-4",
  MEDIUM = "py-4",
}

type ButtonProps = {
  children: JSX.Element | JSX.Element[] | string;
  padding?: ButtonPaddingOptions;
  variant?:
    | "transparent"
    | "red"
    | "green"
    | "hypercolour"
    | "none"
    | "default";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({
  children,
  variant,
  padding = ButtonPaddingOptions.MEDIUM,
  onClick,
  ...rest
}: ButtonProps) => {
  const variantClassNames =
    variant === "transparent"
      ? "text-blue-500 disabled:bg-slate-300 outline outline-blue-500 shadow-md"
      : variant === "red"
      ? "bg-red-500 text-white disabled:bg-red-200 shadow-md"
      : variant === "green"
      ? "bg-green-500 text-white disabled:bg-green-200 shadow-md"
      : variant === "hypercolour"
      ? "background-animate-slow bg-gradient-to-r from-green-500 via-blue-500 to-purple-400 text-white shadow-md"
      : variant === "none"
      ? ""
      : "flex items-center justify-center gap-2 rounded bg-sky-400 px-3 py-2 font-semibold text-sky-950 shadow disabled:bg-sky-600";

  const transition = useTransition();

  const { state } = transition;
  const [clicked, setCliced] = useState(false);

  return (
    <button
      onClick={(e) => {
        setCliced(true);
        if (onClick) onClick(e);
      }}
      {...rest}
      className={`w-full rounded-md px-2 font-semibold  ${variantClassNames} ${padding} ${
        state === "loading" && clicked && "opacity-50"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
