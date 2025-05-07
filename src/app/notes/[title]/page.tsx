import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyNotePassword } from "@/lib/server-actions";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { CollaborativeEditor } from "@/components/collaborative-editor";

interface PageProps {
  params: Promise<{
    title: string;
  }>;
  searchParams: Promise<{
    password?: string;
  }>;
}

export default async function NotePage({ params, searchParams }: PageProps) {
  const paramsData = await params;
  // Decode the title from the URL parameter
  const noteTitle = decodeURIComponent(paramsData.title as string);
  const note = await db.query.notes.findFirst({
    // Fetch by title
    where: (notes, { eq }) => eq(notes.title, noteTitle),
  });

  if (!note) {
    notFound();
  }

  const searchParamsData = await searchParams;
  const password = searchParamsData?.password;
  const isValidPassword = password
    ? // Verify password using the title
      await verifyNotePassword(noteTitle, password)
    : false;

  if (!isValidPassword) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-white/80 w-full max-w-md rounded-2xl shadow-xl border border-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
          <CardHeader className="space-y-1 p-8">
            <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
              {note.title}
            </CardTitle>
            <p className="text-center text-gray-600 text-lg">
              Enter password to access this note
            </p>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form className="flex flex-col gap-6">
              <Input
                type="password"
                name="password"
                placeholder="Enter note password"
                className="h-12 text-lg bg-white/50 border-gray-200/75 focus:border-gray-900/30 focus:ring-gray-900/30"
                required
              />
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 hover:shadow-lg"
              >
                Access Note
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{note.title}</h1>
      </div>
      {/* Pass the actual note ID to the editor */}
      <CollaborativeEditor noteTitle={note.title} password={password} />
    </main>
  );
}
