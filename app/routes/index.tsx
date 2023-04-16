import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import invariant from "invariant";
import {
  Bookmark,
  BookmarkPlus,
  Command,
  Option,
  PlusSquare,
  Sprout,
  Triangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AiFillApple, AiFillWindows } from "react-icons/ai";
import { IoTriangleSharp } from "react-icons/io5";
import Button, { ButtonPaddingOptions } from "~/components/core/Buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/radix/Select";
import { addShortcut, getShortcuts } from "~/utils/db.server";

export const config = { runtime: "edge" };

// const dummyShortcuts: Shortcut[] = [
//   {
//     id: 123123,
//     title: "Cut line",
//     description: "Cut the current line when nothing is selected",
//     upvotes: 10,
//     keys: { mac: ["Cmd", "X"], windows: ["Ctrl", "X"] },
//     category: "General",
//   },
//   {
//     id: 1231233,
//     title: "Copy line",
//     description: "Copy the current line when nothing is selected",
//     upvotes: 10,
//     keys: {
//       mac: ["Cmd", "C"],
//       windows: ["Ctrl", "C"],
//     },
//     category: "General",
//   },
//   {
//     id: 1231234,
//     title: "Remove unused imports",
//     description: "Remove unused imports",
//     upvotes: 10,
//     keys: {
//       mac: ["Cmd", "Option", "O"],
//       // windows: ["Ctrl", "Shift", "O"],
//     },
//     category: "Formatting",
//   },
// ];

export type Shortcut = {
  id: number;
  title: string;
  description: string;
  keys: {
    [key in Device]?: string[];
  };
  upvotes: number;
};

type Device = "mac" | "windows";
type Sort = "upvotes" | "newest" | "saved";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const macKeys = formData.getAll("mac_keys") as string[];
    const windowsKeys = formData.getAll("windows_keys") as string[];

    invariant(title, "Title is required");
    invariant(description, "Description is required");
    if (!macKeys.length && !windowsKeys.length)
      invariant(false, "At least one key is required");

    await addShortcut(title, description, macKeys, windowsKeys);

    return json({});
  } catch (e: any) {
    console.log(e);
    if (e?.name) return json({ error: e.name });

    return json({ error: e });
  }
};

type LoaderData = {
  shortcuts: Shortcut[];
};

type Vote = {
  id: number;
  upvote: boolean;
};

export const loader: LoaderFunction = async () => {
  const shortcuts = await getShortcuts();

  return json<LoaderData>({ shortcuts });
};

const Index = () => {
  const { shortcuts } = useLoaderData<LoaderData>();
  const location = useLocation();
  const [device, setDevice] = useState<Device>(getDefaultDevice());
  const [sort, setSort] = useState<Sort>("upvotes");

  function getDefaultDevice() {
    const searchParams = new URLSearchParams(location.search);
    const defaultDevice = searchParams.get("device") as Device;
    if (defaultDevice === "mac" || defaultDevice === "windows")
      return defaultDevice;

    return "mac";
  }

  useEffect(() => {
    const saved = getSaved();
    const votes = getVotes();

    setSaved(saved);
    setVotedIds(votes);
  }, []);

  const [saved, setSaved] = useState<number[]>([]);
  const [votedIds, setVotedIds] = useState<Vote[]>([]);

  function getSaved(): number[] {
    if (saved.length > 0) return saved;
    const savedString = localStorage.getItem("saved");
    return savedString ? JSON.parse(savedString) : [];
  }

  function getVotes(): Vote[] {
    if (votedIds.length > 0) return votedIds;
    const votesString = localStorage.getItem("votes");
    return votesString ? JSON.parse(votesString) : [];
  }

  return (
    <div className="m-auto flex max-w-5xl flex-col gap-10 text-sky-50">
      <Hero />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-start gap-1">
            Device
            <Select
              defaultValue={device}
              value={device}
              onValueChange={(value: Device) => setDevice(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mac">
                  <span className="flex items-center justify-center gap-2">
                    Mac <AiFillApple size={20} />
                  </span>
                </SelectItem>
                <SelectItem value="windows">
                  <span className="flex items-center justify-center gap-2">
                    Windows
                    <AiFillWindows size={20} />
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col items-start gap-1">
            Sort
            <Select
              defaultValue={sort}
              value={sort}
              onValueChange={(value: Sort) => setSort(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upvotes">
                  <span className="flex items-center justify-center gap-2">
                    Most Upvoted <IoTriangleSharp size="18" />
                  </span>
                </SelectItem>
                <SelectItem value="saved">
                  <span className="flex items-center justify-center gap-2">
                    My saved
                    <Bookmark />
                  </span>
                </SelectItem>
                <SelectItem value="recent">
                  <span className="flex items-center justify-center gap-2">
                    Recent
                    <Sprout />
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center justify-start gap-4 md:grid-cols-2 lg:grid-cols-2">
          {shortcuts.map((shortcut) => (
            <Shortcut
              key={shortcut.id}
              shortcut={shortcut}
              device={device}
              saved={saved}
              setSaved={setSaved}
              votedIds={votedIds}
              setVotedIds={setVotedIds}
            />
          ))}
        </div>
      </section>

      <AddNewShortcut />
    </div>
  );
};

const Shortcut = ({
  shortcut,
  device,
  saved,
  setSaved,
  votedIds,
  setVotedIds,
}: {
  shortcut: Shortcut;
  device: Device;
  saved: number[];
  setSaved: React.Dispatch<React.SetStateAction<number[]>>;
  votedIds: Vote[];
  setVotedIds: React.Dispatch<React.SetStateAction<Vote[]>>;
}) => {
  const keys = shortcut.keys[device];
  if (!keys) return null;

  function onClick() {
    const isSaved = saved.includes(shortcut.id);
    if (isSaved) onDelete();
    else onSave();
  }

  function onSave() {
    try {
      setSaved((curr) => {
        const newSaved = [...curr, shortcut.id];
        localStorage.setItem("saved", JSON.stringify(newSaved));
        return newSaved;
      });
    } catch (e) {
      console.log(e);
    }
  }

  function onDelete() {
    try {
      setSaved((curr) => {
        const newSaved = [...curr.filter((s) => s !== shortcut.id)];
        localStorage.setItem("saved", JSON.stringify(newSaved));
        return newSaved;
      });
    } catch (e) {
      console.log(e);
    }
  }

  function vote(upvote: boolean) {
    if (!isIdle || currentVote?.upvote === upvote) return;

    fetcher.submit(
      { id: `${shortcut.id}`, upvote: `${upvote}` },
      { method: "post", action: `/api/vote` }
    );

    setVotedIds((curr) => {
      const oldVotes = curr.filter((vote) => vote.id !== shortcut.id);
      const newVotes = [...oldVotes, { id: shortcut.id, upvote }];
      localStorage.setItem("votes", JSON.stringify(newVotes));
      return newVotes;
    });
  }

  const fetcher = useFetcher();
  const isIdle = fetcher.state === "idle";

  const currentVote: Vote | undefined = votedIds.filter(
    (vote) => vote.id === shortcut.id
  )?.[0];

  return (
    <div className="flex flex-col gap-4 rounded bg-slate-800 px-3 py-2 text-sky-100 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center justify-center gap-2">
          <span className="flex flex-col gap-1">
            <Triangle
              className={`cursor-pointer ${
                currentVote?.upvote ? "fill-sky-50" : "fill-none"
              } stroke-sky-50`}
              onClick={() => vote(true)}
            />
            <Triangle
              className={`rotate-180 cursor-pointer ${
                currentVote?.upvote === false ? "fill-sky-50" : "fill-none"
              } stroke-sky-50`}
              onClick={() => vote(false)}
            />
          </span>
          <span>{shortcut.upvotes}</span>
        </span>

        <h4 className="font-semibold">{shortcut.title}</h4>
        <div className="w-fit">
          <Button onClick={onClick} padding={ButtonPaddingOptions.SMALL}>
            <>
              {saved.includes(shortcut.id) ? "Saved" : "Save"}
              {saved.includes(shortcut.id) ? (
                <Bookmark className="fill-sky-950" />
              ) : (
                <BookmarkPlus />
              )}
            </>
          </Button>
        </div>
      </div>

      <p>{shortcut.description}</p>
      <Keys keys={keys} />
    </div>
  );
};

const Keys = ({ keys }: { keys: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key, index) => (
        <Key key={index}>{key}</Key>
      ))}
    </div>
  );
};

const Key = ({ children }: { children: string }) => {
  const icon = getIcon(children);

  function getIcon(key: string) {
    if (key === "Cmd") return <Command />;
    if (key === "Option") return <Option />;
  }

  return (
    <span className="text flex items-center justify-center gap-1 rounded border border-sky-700 bg-sky-800 px-2 py-1 text-sky-100">
      {icon ?? children}
    </span>
  );
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="my-4 flex flex-col items-center justify-center gap-8 text-center"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-sky-100">
        VSCode Shortcuts: The open source VSCode cheat sheet
      </h1>
      <p className="text-left">
        Discover the best Visual Studio Code shortcuts and hotkeys to speed up
        your coding workflow. Vote on and submit your favourite shortcuts, as
        well as discover new shortcuts shared by the community, so you can
        become a vscode wizard 🪄.
      </p>
    </section>
  );
};

const Input = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      className="rounded px-2 py-1 text-sky-950 shadow"
    />
  );
};

const AddNewShortcut = () => {
  const [macKeyCount, setMacKeyCount] = useState(1);
  const [windowsKeyCount, setWindowsKeyCount] = useState(1);
  const fetcher = useFetcher();

  return (
    <section id="new-shortcut" className="mb-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Submit a new VSCode Shortcut</h2>
        <p>
          Have a shortcut that you love that's not listed on our website? You
          can submit it to our database and share it with the community.
        </p>
      </div>

      <fetcher.Form
        action="?index"
        method="post"
        className="flex flex-col gap-6 rounded bg-slate-700 p-4 shadow"
      >
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Title</span>
          <Input name="title" placeholder="Title" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-semibold">Description</span>
          <Input name="description" placeholder="Description" />
        </label>

        <label className="flex flex-col gap-2 [&>input]:rounded [&>input]:px-2 [&>input]:py-1 [&>input]:text-sky-950 [&>input]:shadow">
          Mac key bindings
          {Array.from({ length: macKeyCount }, (_, i) => (
            <Input key={i} name="mac_keys" placeholder={`Key ${i + 1}`} />
          ))}
          <button
            type="button"
            onClick={() => setMacKeyCount((count) => count + 1)}
          >
            <PlusSquare />
          </button>
        </label>

        <label className="flex flex-col gap-2 [&>input]:rounded [&>input]:px-2 [&>input]:py-1 [&>input]:text-sky-950 [&>input]:shadow">
          Windows key bindings
          {Array.from({ length: windowsKeyCount }, (_, i) => (
            <Input key={i} name="windows_keys" placeholder={`Key ${i + 1}`} />
          ))}
          <button
            type="button"
            onClick={() => setWindowsKeyCount((count) => count + 1)}
          >
            <PlusSquare />
          </button>
        </label>

        <Button
          type="submit"
          className="flex items-center justify-center gap-2 rounded bg-sky-50 px-3 py-2 font-semibold text-sky-800 shadow"
        >
          <>
            Add Shortcut <PlusSquare />
          </>
        </Button>
      </fetcher.Form>

      {fetcher.data?.success && (
        <p className="rounded bg-green-400 px-2 py-1 font-semibold text-sky-950 shadow">
          Shortcut added
        </p>
      )}
      {fetcher?.data?.error && (
        <p className="rounded bg-red-400 px-2 py-1 font-semibold text-sky-950 shadow">
          {fetcher.data.error}
        </p>
      )}
    </section>
  );
};

export default Index;
