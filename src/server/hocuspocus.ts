import { Hocuspocus } from "@hocuspocus/server";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyNotePassword } from "../lib/server-actions";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!process.env.HOCUSPOCUS_SECRET) {
  throw new Error("HOCUSPOCUS_SECRET is not set");
}

const db = drizzle(process.env.DATABASE_URL, { schema });

export const hocuspocus = new Hocuspocus({
  port: Number(process.env.HOCUSPOCUS_PORT) || 3001,
  name: "collab-notes",
  async onAuthenticate(data) {
    const { token, documentName } = data;

    const isValid = await verifyNotePassword(documentName, token);

    if (!isValid) {
      throw new Error("Invalid token");
    }

    return true;
  },
  async onLoadDocument(data) {
    const { documentName } = data;

    const note = await db.query.notes.findFirst({
      where: (notes, { eq }) => eq(notes.title, documentName),
    });

    if (!note) {
      throw new Error("Note not found");
    }

    return note.content;
  },
  async onStoreDocument(data) {
    const { documentName, document } = data;

    await db
      .update(schema.notes)
      .set({
        content: document.toString(),
        updatedAt: new Date(),
      })
      .where(eq(schema.notes.id, documentName));
  },
});
