'use server';

import { db } from "@/db";
import { notes } from "@/db/schema";
import { nanoid } from "nanoid";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { generate } from "random-words";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  const password = formData.get("password") as string;

  if (!title || !password) {
    throw new Error("Title and password are required");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const noteId = nanoid();

  await db.insert(notes).values({
    id: noteId,
    title,
    passwordHash,
    content: "",
  });

  redirect(`/notes/${noteId}`);
}

export async function verifyNotePassword(noteId: string, password: string) {
  const note = await db.query.notes.findFirst({
    where: (notes, { eq }) => eq(notes.id, noteId),
  });

  if (!note) {
    throw new Error("Note not found");
  }

  const isValid = await bcrypt.compare(password, note.passwordHash);
  return isValid;
}

export async function generateUserInfo() {
  const avatar = createAvatar(adventurerNeutral, {
    seed: nanoid(),
  });

  const words = generate({
    exactly: 2,
    wordsPerString: 1,
    separator: '-'
  }) as string[];

  const username = words.join('-');

  return {
    userId: nanoid(),
    username,
    avatarUrl: `data:image/svg+xml;base64,${Buffer.from(avatar.toString()).toString('base64')}`,
  };
} 