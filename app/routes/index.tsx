import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useFetcher, useLocation } from "@remix-run/react";
import invariant from "invariant";
import {
  Bookmark,
  BookmarkPlus,
  Command,
  Option,
  PlusSquare,
  Sprout,
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

function getSaved(): number[] {
  const savedString = localStorage.getItem("saved");
  return savedString ? JSON.parse(savedString) : [];
}

const shortcuts: Shortcut[] = [
  {
    id: 123123,
    title: "Cut line",
    description: "Cut the current line when nothing is selected",
    upvotes: 10,
    keys: { mac: ["Cmd", "X"], windows: ["Ctrl", "X"] },
    category: "General",
  },
  {
    id: 1231233,
    title: "Copy line",
    description: "Copy the current line when nothing is selected",
    upvotes: 10,
    keys: {
      mac: ["Cmd", "C"],
      windows: ["Ctrl", "C"],
    },
    category: "General",
  },
  {
    id: 1231234,
    title: "Remove unused imports",
    description: "Remove unused imports",
    upvotes: 10,
    keys: {
      mac: ["Cmd", "Option", "O"],
      // windows: ["Ctrl", "Shift", "O"],
    },
    category: "Formatting",
  },
];

type Shortcut = {
  id: number;
  title: string;
  description: string;
  keys: {
    [key in Device]?: string[];
  };
  upvotes: number;
  category: string;
};

type Device = "mac" | "windows";
type Sort = "upvotes" | "newest" | "saved";

export const action: ActionFunction = async ({ request }) => {
  try {
    console.log("here");

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const keys = formData.getAll("keys") as string[];
    invariant(title, "Title is required");
    invariant(description, "Description is required");
    invariant(keys, "Keys are required");

    console.log("here");
    await addShortcut(title, description, keys);

    return json({});
  } catch (e: any) {
    console.log(e);
    if (e?.name) return json({ error: e.name });

    return json({ error: e });
  }
};

export const loader: LoaderFunction = async () => {
  const shortcuts = await getShortcuts();
  console.log(shortcuts);
  return json({});
};

const Index = () => {
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
    setSaved(saved);
  }, []);

  const [saved, setSaved] = useState<number[]>([]);

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
}: {
  shortcut: Shortcut;
  device: Device;
  saved: number[];
  setSaved: React.Dispatch<React.SetStateAction<number[]>>;
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

  return (
    <div className="flex flex-col gap-4 rounded bg-slate-800 px-3 py-2 text-sky-100 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center justify-center gap-2">
          <span className="flex flex-col gap-1">
            <IoTriangleSharp size="18" className="cursor-pointer" />
            <IoTriangleSharp className="rotate-180 cursor-pointer" size="18" />
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

const AddNewShortcut = () => {
  function add() {
    alert("add");
  }

  const [keyCount, setKeyCount] = useState(1);
  const fetcher = useFetcher();
  console.log(fetcher.data?.error);

  return (
    <section id="new-shortcut" className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Submit a new VSCode Shortcut</h2>
      <p>
        Have a shortcut that you love that's not listed on our website? You can
        submit it to our database and share it with the community.
      </p>

      <fetcher.Form
        action="?index"
        method="post"
        className="flex flex-col gap-2 [&>input]:rounded [&>input]:px-2 [&>input]:py-1 [&>input]:text-sky-950 [&>input]:shadow"
      >
        <input type="text" name="title" placeholder="Title" />
        <input type="text" name="description" placeholder="Description" />
        <label>Key bindings</label>
        {Array.from({ length: keyCount }, (_, i) => (
          <input key={i} type="text" name="keys" placeholder={`Key ${i + 1}`} />
        ))}

        <button type="button" onClick={() => setKeyCount((count) => count + 1)}>
          <PlusSquare />
        </button>

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
