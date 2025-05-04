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
    // Verify password using the title
    ? await verifyNotePassword(noteTitle, password)
    : false;

  if (!isValidPassword) {
    return (
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Enter Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex gap-2">
              <Input
                type="password"
                name="password"
                placeholder="Enter note password"
                required
              />
              <Button type="submit">Submit</Button>
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
      <CollaborativeEditor noteTitle={note.title} password={password}/>
    </main>
  );
}
