"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { generateUserInfo } from "@/lib/server-actions";
import Image from "next/image";

interface CollaborativeEditorProps {
  noteTitle: string;
  password?: string;
}

interface UserInfo {
  userId: string;
  username: string;
  avatarUrl: string;
}

export function CollaborativeEditor({ noteTitle, password }: CollaborativeEditorProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  if (!process.env.NEXT_PUBLIC_HOCUSPOCUS_URL) {
    throw new Error("NEXT_PUBLIC_HOCUSPOCUS_URL is not set");
  }

  const [provider] = useState(
    () =>
      new HocuspocusProvider({
        url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
        name: noteTitle,
        token: password,
      })
  );

  useEffect(() => {
    generateUserInfo().then(setUserInfo);

    return () => {
      provider.destroy();
    };
  }, [provider]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Collaboration.configure({
          document: provider.document,
        }),
        CollaborationCursor.configure({
          provider: provider,
          user: userInfo
            ? {
                name: userInfo.username,
                color: "#" + Math.floor(Math.random() * 16777215).toString(16),
              }
            : undefined,
        }),
      ],
      content: "<p>Start typing here...</p>",
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4",
        },
      },
      immediatelyRender: false,
    },
    [userInfo]
  );

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative border rounded-lg shadow-sm">
      <style jsx global>{`
        .collaboration-cursor__caret {
          border-left: 1px solid #0d0d0d;
          border-right: 1px solid #0d0d0d;
          margin-left: -1px;
          margin-right: -1px;
          pointer-events: none;
          position: relative;
          word-break: normal;
        }

        .collaboration-cursor__label {
          background-color: rgb(#0d0d0d);
          border-radius: 3px;
          color: #fff;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          left: -1px;
          line-height: normal;
          padding: 0.1rem 0.3rem;
          position: absolute;
          top: -1.4em;
          user-select: none;
          white-space: nowrap;
        }
      `}</style>
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Image
          src={userInfo.avatarUrl}
          alt={userInfo.username}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span className="text-sm">{userInfo.username}</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
