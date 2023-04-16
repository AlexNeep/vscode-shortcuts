import { Shortcut } from "~/routes";
import { supabase } from "~/services/db.server";

export async function getShortcuts(): Promise<Shortcut[]> {
  try {
    const res = await supabase
      .from("shortcuts")
      .select("id,title,description,keys,upvotes");

    return res.data?.map((shortcut) => ({
      ...shortcut,
      keys: JSON.parse(shortcut.keys),
    })) as Shortcut[];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function addShortcut(
  title: string,
  description: string,
  macKeys: string[],
  windowsKeys: string[]
) {
  const data = {
    title,
    description,
    keys: JSON.stringify({
      mac: macKeys.filter((x) => x),
      windows: windowsKeys.filter((x) => x),
    }),
    upvotes: 0,
  };

  try {
    const res = await supabase.from("shortcuts").insert(data);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

export async function upvoteShortcut(id: number) {
  try {
    await supabase.rpc("increment", { row_id: id });
  } catch (err) {
    console.log(err);
  }
}

export async function downvoteShortcut(id: number) {
  try {
    await supabase.rpc("decrement", { row_id: id });
  } catch (err) {
    console.log(err);
  }
}
