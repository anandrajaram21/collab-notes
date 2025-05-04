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
    // Consider returning an error message to the user instead of throwing
    throw new Error("Title and password are required");
  }

  // Check if a note with this title already exists
  const existingNote = await db.query.notes.findFirst({
    where: (notes, { eq }) => eq(notes.title, title),
  });

  if (existingNote) {
    // Handle duplicate title - maybe redirect back with an error?
    // For now, let's throw an error
    throw new Error(`Note with title "${title}" already exists.`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const noteId = nanoid(); // Keep using nanoid for the internal ID

  await db.insert(notes).values({
    id: noteId, // Still store the unique ID
    title,
    passwordHash,
    content: "", // Initialize content
  });

  // Redirect using the title
  redirect(`/notes/${encodeURIComponent(title)}`);
}

export async function verifyNotePassword(noteTitle: string, password: string) {
  const note = await db.query.notes.findFirst({
    // Find by title instead of ID
    where: (notes, { eq }) => eq(notes.title, noteTitle),
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