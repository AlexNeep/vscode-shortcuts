import { json } from "@vercel/remix";
import type { ActionFunction } from "@remix-run/node";
import { downvoteShortcut, upvoteShortcut } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const upvote = Boolean(formData.get("upvote") === "true");

    if (upvote) await upvoteShortcut(id);
    else await downvoteShortcut(id);
  } catch (error) {
    console.log(error);
  }

  return json({});
};
