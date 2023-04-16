import { useMatches } from "@remix-run/react";
import { useEffect } from "react";
import { ProfileLoaderData } from "~/routes/profile";
import { RootLoaderData } from "~/root";

export function useOutsideAlerter(ref: any, onOutsideClick: Function) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export function useRootData() {
  const matches = useMatches();
  const rootMatch = matches.find((root) => root.id === "root");

  if (!rootMatch) return null;

  return rootMatch.data as RootLoaderData;
}

export function useProfileLoaderData() {
  const matches = useMatches();
  const profileMatch = matches.find((root) => root.id === "routes/profile");

  if (!profileMatch) return null;

  return profileMatch.data as ProfileLoaderData;
}
