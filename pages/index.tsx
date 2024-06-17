import { useState } from "react";
import TipTapEditor from "src/ui/TiptapEditor";
import { Button } from "src/ui/button";

export default function Index() {
  const [content, setContent] = useState<string>("");
  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  console.log("content is ", content);

  return (
    <div className="text-3xl">
      <Button>Hello</Button>
      <TipTapEditor
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </div>
  );
}

Index.noLayout = false;
