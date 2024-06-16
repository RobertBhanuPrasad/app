import { useState } from "react";
// import Editor from "src/ui/QuillEditor";
import QuillToolbar from "src/ui/QuillToolbar";
import Tiptap from "src/ui/TiptapEditor";
// import Tiptap from "src/ui/TiptapEditor";
import { Button } from "src/ui/button";

export default function Index() {
  const [content, setContent] = useState<string>("");
  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  return (
    <div className="text-3xl">
      <Button>Hello</Button>
      {/* <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      /> */}
      <QuillToolbar />
      {/* <Editor placeholder="Write something..." /> */}
    </div>
  );
}

Index.noLayout = false;
