"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNote } from "@/lib/server-actions";
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react'; // Import useState

export default function Home() {
  const router = useRouter();
  const [noteTitle, setNoteTitle] = useState(''); // State for note title

  const handleViewNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = noteTitle.trim();
    if (trimmedTitle) {
      // Navigate using the encoded title
      router.push(`/notes/${encodeURIComponent(trimmedTitle)}`);
    }
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold text-center mt-8">Collaborative Notes</h1>
      <p className="text-lg text-center max-w-md">
        Welcome to Collaborative Notes! Create new notes with a unique name and password, or access existing notes using their unique name.
      </p>

      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* View Note Form */}
        <form onSubmit={handleViewNote} className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">View Existing Note</h2>
          <Input
            type="text"
            value={noteTitle} // Bind to noteTitle state
            onChange={(e) => setNoteTitle(e.target.value)} // Update noteTitle state
            placeholder="Enter Note Title" // Update placeholder
            required
          />
          <Button type="submit">View Note</Button>
        </form>

        {/* Create Note Form */}
        <form action={createNote} className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm">
           <h2 className="text-xl font-semibold mb-2">Create New Note</h2>
          <Input type="text" name="title" placeholder="Note title (unique name)" required />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Button type="submit">Create Note</Button>
        </form>
      </div>
    </main>
  );
}
