import { Link, useLocation } from "@remix-run/react";

const Footer = () => {
  const location = useLocation();
  const hideFooter =
    location?.pathname.includes("/scenarios") ||
    location?.pathname.includes("/lessons/");
  if (hideFooter) return null;

  return (
    <div className="mt-4 w-full border-t border-slate-300/10 p-4">
      <div className="relative m-auto flex h-full w-full max-w-5xl items-center justify-center gap-2 text-sky-100">
        <a href="https://twitter.com/AIndieDeveloper">Built with 💙 by Alex</a>
        <img
          src="https://pbs.twimg.com/profile_images/1508746861733163015/XEut_J3K_400x400.jpg"
          loading="lazy"
          className="h-8 w-8 rounded-3xl shadow-inner"
        />
      </div>
    </div>
  );
};

export default Footer;
