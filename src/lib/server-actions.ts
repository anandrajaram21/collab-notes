"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { nanoid } from "nanoid";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { generate } from "random-words";
import bcrypt from "bcryptjs";

export async function createNote(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean; title?: string }> {
  const title = formData.get("title") as string;
  const password = formData.get("password") as string;

  if (!title || !password) {
    return { error: "Title and password are required" };
  }

  // Check if a note with this title already exists
  const existingNote = await db.query.notes.findFirst({
    where: (notes, { eq }) => eq(notes.title, title),
  });

  if (existingNote) {
    return { error: `Note with title "${title}" already exists.` };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const noteId = nanoid(); // Keep using nanoid for the internal ID

  await db.insert(notes).values({
    id: noteId, // Still store the unique ID
    title,
    passwordHash,
    content: "", // Initialize content
  });

  // Instead of redirecting, return success and title for client-side navigation
  return { success: true, title: encodeURIComponent(title) };
}

export async function checkNoteExistsByTitle(
  title: string
): Promise<{ exists: boolean; error?: string }> {
  "use server";
  if (!title) {
    return { exists: false, error: "Title is required" };
  }
  try {
    const existingNote = await db.query.notes.findFirst({
      where: (notes, { eq }) => eq(notes.title, title),
    });
    return { exists: !!existingNote };
  } catch (e) {
    console.error("Error checking note existence:", e);
    return { exists: false, error: "Failed to check note existence." };
  }
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
    separator: "-",
  }) as string[];

  const username = words.join("-");

  return {
    userId: nanoid(),
    username,
    avatarUrl: `data:image/svg+xml;base64,${Buffer.from(
      avatar.toString()
    ).toString("base64")}`,
  };
}
