"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNote, checkNoteExistsByTitle } from "@/lib/server-actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState = {
  error: undefined,
  success: undefined,
  title: undefined,
};

function CreateNoteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200"
    >
      {pending ? "Creating..." : "Create Note"}
    </Button>
  );
}

export default function Home() {
  const router = useRouter();
  const [viewNoteTitle, setViewNoteTitle] = useState("");
  const [viewNoteError, setViewNoteError] = useState<string | null>(null);

  const [createNoteState, formAction] = useActionState(
    createNote,
    initialState
  );

  useEffect(() => {
    if (createNoteState.success && createNoteState.title) {
      router.push(`/notes/${createNoteState.title}`);
    }
  }, [createNoteState, router]);

  const handleViewNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setViewNoteError(null);
    const trimmedTitle = viewNoteTitle.trim();
    if (trimmedTitle) {
      const result = await checkNoteExistsByTitle(trimmedTitle);
      if (result.exists) {
        router.push(`/notes/${encodeURIComponent(trimmedTitle)}`);
      } else {
        setViewNoteError(result.error || "Note not found.");
      }
    } else {
      setViewNoteError("Please enter a note title.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-16">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-8">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 animate-gradient">
              Collaborative Notes
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Create and share notes seamlessly. Your collaborative workspace
            starts here.
          </p>
        </div>

        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 pointer-events-none">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-gray-700 to-gray-900"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-900 to-gray-700"></div>
          </div>

          <div className="relative max-w-5xl mx-auto grid gap-8 lg:grid-cols-2">
            {/* View Note Card */}
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
              <form onSubmit={handleViewNote} className="flex flex-col h-full">
                <div className="p-8 flex flex-col h-full gap-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">
                      View Note
                    </h2>
                    <p className="text-gray-500 text-lg">
                      Access your existing notes
                    </p>
                  </div>

                  <div className="flex-grow space-y-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="noteTitle"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Note Title
                      </label>
                      <Input
                        id="noteTitle"
                        type="text"
                        value={viewNoteTitle}
                        onChange={(e) => setViewNoteTitle(e.target.value)}
                        placeholder="Enter the title of your note"
                        className="h-12 text-lg w-full px-4 bg-white/50 border-gray-200/75 focus:border-gray-900/30 focus:ring-gray-900/30 transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Quick Tips
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">
                          • Enter the exact title of your note
                        </li>
                        <li className="flex items-center gap-2">
                          • Titles are case-sensitive
                        </li>
                        <li className="flex items-center gap-2">
                          • You'll need the note's password to edit
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 hover:shadow-lg"
                    >
                      View Note
                    </Button>
                    {viewNoteError && (
                      <p className="text-sm text-red-500 mt-3">
                        {viewNoteError}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Create Note Card */}
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
              <form action={formAction} className="flex flex-col h-full">
                <div className="p-8 flex flex-col h-full gap-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Create Note
                    </h2>
                    <p className="text-gray-500 text-lg">
                      Start a new collaborative note
                    </p>
                  </div>

                  <div className="flex-grow space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Note Title
                      </label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="Choose a unique name for your note"
                        className="h-12 text-lg w-full px-4 bg-white/50 border-gray-200/75 focus:border-gray-900/30 focus:ring-gray-900/30 transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Set a secure password"
                        className="h-12 text-lg w-full px-4 bg-white/50 border-gray-200/75 focus:border-gray-900/30 focus:ring-gray-900/30 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <CreateNoteSubmitButton />
                    {createNoteState?.error && (
                      <p className="text-sm text-red-500 mt-3">
                        {createNoteState.error}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
