import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createNote } from "@/lib/server-actions";
import { db } from "@/db";
import { notes } from "@/db/schema";
import Link from "next/link";

export default async function Home() {
  const allNotes = await db.select().from(notes);

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Collaborative Notes</h1>
        <form action={createNote} className="flex gap-2">
          <Input type="text" name="title" placeholder="Note title" required />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Button type="submit">Create Note</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allNotes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>
                Created {new Date(note.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/notes/${note.id}`}>
                <Button variant="outline" className="w-full">
                  Open Note
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
