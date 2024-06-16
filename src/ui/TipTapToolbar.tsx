import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  Image as ImageIcon,
} from "lucide-react";

type Props = {
  editor: Editor | null;
  content: string;
  uploadImage: (file: File) => void;
};

const Toolbar = ({ editor, content, uploadImage }: Props) => {
  if (!editor) {
    return null;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      uploadImage(file);
    }
  };

  return (
    <div
      className="flex px-3 items-center rounded-[8px] rounded-tr-md flex justify-start
    gap-5 w-full flex-wrap bg-[#FAFAFA] h-[44px]"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        className={
          editor.isActive("undo")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : "hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
        }
      >
        <Undo className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        className={
          editor.isActive("redo")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : "hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
        }
      >
        <Redo className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={
          editor.isActive("bold") ? "bg-sky-700 text-white p-2 rounded-lg" : ""
        }
      >
        <Bold className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={
          editor.isActive("italic")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <Italic className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={
          editor.isActive("underline")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <Underline className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={
          editor.isActive("strike")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <Strikethrough className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <Heading2 className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={
          editor.isActive("bulletList")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <List className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={
          editor.isActive("orderedList")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <ListOrdered className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={
          editor.isActive("blockquote")
            ? "bg-sky-700 text-white p-2 rounded-lg"
            : ""
        }
      >
        <Quote className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setCode().run();
        }}
        className={
          editor.isActive("code") ? "bg-sky-700 text-white p-2 rounded-lg" : ""
        }
      >
        <Code className="w-5 h-5" />
      </button>

      <input
        type="file"
        id="image-upload"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("image-upload")?.click();
        }}
        className="hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;
