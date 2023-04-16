import { supabase } from "~/services/db.server";

export async function getShortcuts() {
  try {
    const res = await supabase
      .from("shortcuts")
      .select("id,title,description,keys");

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function addShortcut(
  title: string,
  description: string,
  keys: string[]
) {
  const data = {
    title,
    description,
    keys: JSON.stringify(keys),
  };

  try {
    const res = await supabase.from("shortcuts").insert(data);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
