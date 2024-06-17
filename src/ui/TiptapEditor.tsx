"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import Document from "@tiptap/extension-document";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { TipTapToolbar } from "./TipTapToolbar";

interface ITipTapEditorProps {
  onChange: (content: string) => void;
  content: string;
}

const TipTapEditor = ({ onChange, content }: ITipTapEditorProps) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit,
      Underline,
      Image,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "px-4 py-3 border-b border-r border-l border-gray-700 text-[18px] w-full gap-3 pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(
      //   "editor is ",
      //   editor,
      //   editor.getHTML(),
      //   editor.getJSON(),
      //   editor.getText()
      // );
      handleChange(editor.getHTML());
    },
    content: content,
  });

  return (
    <div className="px-4 bg-[white] space-y-5 w-full">
      <TipTapToolbar editor={editor as Editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
