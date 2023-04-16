import * as Dialog from "@radix-ui/react-dialog";
import { useFetcher } from "@remix-run/react";
import {
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { IoMdClose } from "react-icons/io";
import { createAccount } from "~/routes/login";

import { clientAuth } from "~/services/firebase";
import { useRootData } from "~/utils/hooks";
import { SUBSCRIBED_USER_MESSAGES } from "~/utils/payment";
import { UserProfile } from "~/utils/types";
import ErrorMessage from "../core/ErrorMessage";
import BulletPoint from "../landing-page/SubBulletPoint";

const LoginModal = ({
  open,
  onClose,
  redirect,
  variant = "default",
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  variant?: "default" | "pricing";
  redirect?: string;
}) => {
  const fetcher = useFetcher();
  const [error, setError] = useState("");
  const user = useRootData()?.user;
  const [referrer, setReferrer] = useState("");

  useEffect(() => {
    setReferrer(document.referrer);
  }, []);

  useEffect(() => {
    if (fetcher.data?.success) window.location.reload();
  }, [fetcher]);

  const handleGoogleLogin = (user: UserProfile | undefined) => {
    if (user) linkGuestWithGoogleAccount();
    else loginWithGoogle();
  };

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(clientAuth, provider)
      .then((userCredentials) =>
        createAccount({
          userCredentials,
          fetcher,
          marketingEmails: true,
          referrer,
          redirect,
        })
      )
      .catch((e) => console.log(e));
  }

  function linkGuestWithGoogleAccount() {
    const provider = new GoogleAuthProvider();
    signInAnonymously(clientAuth).then((usercred) => {
      const user = usercred.user;

      linkWithPopup(user, provider)
        .then(() => {
          fetcher.submit(
            { email: user.email ?? "" },
            { method: "post", action: "/api/login/link-guest-account" }
          );
        })
        .catch((e) => {
          const duplicateAccount =
            "Firebase: Error (auth/credential-already-in-use).";
          const duplicateAccountMsg =
            "This Google account is already linked to another account. Please login with that account or use a different Google account.";
          if (e?.message === duplicateAccount)
            return setError(duplicateAccountMsg);

          setError("Something went wrong");
        });
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-500 opacity-30" />
        <Dialog.Content className="fixed top-[50%] left-[50%] flex w-[90vw] max-w-xl translate-x-[-50%] translate-y-[-50%] flex-col gap-8 rounded-lg bg-white py-10 px-6">
          {variant === "default" && (
            <DefaultContent
              handleGoogleLogin={handleGoogleLogin}
              error={error}
              user={user}
            />
          )}
          {variant === "pricing" && (
            <PricingContent
              handleGoogleLogin={handleGoogleLogin}
              error={error}
              user={user}
            />
          )}
          <Dialog.Close asChild className="absolute top-2 right-2 ">
            <button aria-label="Close">
              <IoMdClose className="fill-slate-400" size="30" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const DefaultContent = ({
  handleGoogleLogin,
  error,
  user,
}: {
  handleGoogleLogin: (user: UserProfile | undefined) => void;
  error: string;
  user: UserProfile | undefined;
}) => {
  const fullAccessFeatures = [
    `${SUBSCRIBED_USER_MESSAGES.free} more AI-powered messages`,
    "Access to all scenarios",
    "Generate translations",
    "Practise listening audio",
    "Track your vocabulary growth",
  ];

  return (
    <>
      <div className="flex flex-col gap-10">
        <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-blue-800">
          Sign up for full access
        </h2>

        <div className="flex flex-col items-start justify-center gap-2">
          {fullAccessFeatures.map((text, index) => (
            <BulletPoint key={index} point={text} />
          ))}
        </div>

        <hr className="mx-auto w-1/2 border-gray-400" />

        <div className="flex flex-col items-center justify-center gap-4">
          <GoogleButton
            label="Signup with Google"
            onClick={() => handleGoogleLogin(user)}
          />

          {error && <ErrorMessage error={error} />}
        </div>
      </div>
    </>
  );
};

const PricingContent = ({
  handleGoogleLogin,
  error,
  user,
}: {
  handleGoogleLogin: (user: UserProfile | undefined) => void;
  error: string;
  user: UserProfile | undefined;
}) => {
  return (
    <>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-lg font-semibold text-blue-800">
            Bye bye foreign language anxiety
          </h2>
          <p>Start your free trial now by creating an account in seconds.</p>
        </section>

        <hr className="mx-auto w-1/2 border-gray-400" />

        <div className="flex flex-col items-center justify-center gap-4">
          <GoogleButton
            label="Signup with Google"
            onClick={() => handleGoogleLogin(user)}
          />
          <p className="text-center text-sm text-gray-400">
            After signing up, you'll then be taken to our payment provider to
            start your free trial.
          </p>
          {error && <ErrorMessage error={error} />}
        </div>
      </div>
    </>
  );
};
export default LoginModal;
