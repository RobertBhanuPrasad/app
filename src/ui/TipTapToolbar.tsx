import { BlockQuoteIcon } from "@public/assets/Editor/BlockQuoteIcon";
import { BoldIcon } from "@public/assets/Editor/BoldIcon";
import { CodeIcon } from "@public/assets/Editor/CodeIcon";
import { ImageIcon } from "@public/assets/Editor/ImageIcon";
import { ItalicIcon } from "@public/assets/Editor/ItalicIcon";
import { LinkIcon } from "@public/assets/Editor/LinkIcon";
import { ListIcon } from "@public/assets/Editor/ListIcon";
import { OrderListIcon } from "@public/assets/Editor/OrderListIcon";
import { RedoIcon } from "@public/assets/Editor/RedoIcon";
import { StrikeIcon } from "@public/assets/Editor/StrikeIcon";
import { UnderlineIcon } from "@public/assets/Editor/UnderlineIcon";
import { UndoIcon } from "@public/assets/Editor/UndoIcon";
import { type Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "src/lib/utils";

interface ITipTapToolbar {
  editor: Editor;
}
export const TipTapToolbar = ({ editor }: ITipTapToolbar) => {
  return (
    <section className="w-full bg-[#FAFAFA] min-h-11 rounded-[12px] px-2 flex items-center justify-between flex-wrap">
      <section className="flex">
        <UndoButton editor={editor} />
        <RedoButton editor={editor} />
      </section>

      <TextSizeDropdown editor={editor} />

      <section>
        <AlignmentDropdown editor={editor} />
      </section>

      <section>
        <ColorDropdown editor={editor} />
      </section>

      <section>
        <BoldButton editor={editor} />
        <ItalicButton editor={editor} />
        <UnderlineButton editor={editor} />
        <StrikeButton editor={editor} />
      </section>

      <section>
        <ListButton editor={editor} />
        <OrderListButton editor={editor} />
      </section>

      <section>
        <LinkButton editor={editor} />
        <ImageButton editor={editor} />
        <CodeButton editor={editor} />
        <BlockQuoteButton editor={editor} />
      </section>
    </section>
  );
};

type IToolbarButton = {
  children: React.ReactNode;
  handleClick: () => void;
  isActive?: boolean;
};

export const ToolbarButton = ({
  children,
  handleClick,
  isActive,
}: IToolbarButton) => {
  return (
    <button
      className={cn(
        "hover:bg-[#5E5FC3] text-black hover:fill-white hover:rounded-[5px]",
        isActive && "bg-[#5E5FC3] fill-white rounded-[5px]"
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

interface IUndoButton extends ITipTapToolbar {}
export const UndoButton = ({ editor }: IUndoButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().undo().run();
      }}
    >
      <UndoIcon />
    </ToolbarButton>
  );
};

interface IRedoButton extends ITipTapToolbar {}
export const RedoButton = ({ editor }: IRedoButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().redo().run();
      }}
    >
      <RedoIcon />
    </ToolbarButton>
  );
};

interface IBoldButton extends ITipTapToolbar {}
export const BoldButton = ({ editor }: IBoldButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleBold().run();
      }}
      isActive={editor?.isActive("bold")}
    >
      <BoldIcon />
    </ToolbarButton>
  );
};

interface IItalicButton extends ITipTapToolbar {}
export const ItalicButton = ({ editor }: IItalicButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleItalic().run();
      }}
      isActive={editor?.isActive("italic")}
    >
      <ItalicIcon />
    </ToolbarButton>
  );
};

interface IUnderlineButton extends ITipTapToolbar {}
export const UnderlineButton = ({ editor }: IUnderlineButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleUnderline().run();
      }}
      isActive={editor?.isActive("underline")}
    >
      <UnderlineIcon />
    </ToolbarButton>
  );
};

interface IStrikeButton extends ITipTapToolbar {}
export const StrikeButton = ({ editor }: IStrikeButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleStrike().run();
      }}
      isActive={editor?.isActive("strike")}
    >
      <StrikeIcon />
    </ToolbarButton>
  );
};

interface IListButton extends ITipTapToolbar {}
export const ListButton = ({ editor }: IListButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleBulletList().run();
      }}
      isActive={editor?.isActive("bulletList")}
    >
      <ListIcon />
    </ToolbarButton>
  );
};

interface IOrderListButton extends ITipTapToolbar {}
export const OrderListButton = ({ editor }: IOrderListButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleOrderedList().run();
      }}
      isActive={editor?.isActive("orderedList")}
    >
      <OrderListIcon />
    </ToolbarButton>
  );
};

interface ILinkButton extends ITipTapToolbar {}
export const LinkButton = ({ editor }: ILinkButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) {
          return;
        }
        if (url === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }}
      isActive={editor?.isActive("link")}
    >
      <LinkIcon />
    </ToolbarButton>
  );
};

interface IImageButton extends ITipTapToolbar {}
export const ImageButton = ({ editor }: IImageButton) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        id="image-upload"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      <ToolbarButton
        handleClick={() => {
          document.getElementById("image-upload")?.click();
        }}
        isActive={editor?.isActive("image")}
      >
        <ImageIcon />
      </ToolbarButton>
    </>
  );
};

interface ICodeButton extends ITipTapToolbar {}
export const CodeButton = ({ editor }: ICodeButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleCode().run();
      }}
      isActive={editor?.isActive("code")}
    >
      <CodeIcon />
    </ToolbarButton>
  );
};

interface IQuoteButton extends ITipTapToolbar {}
export const BlockQuoteButton = ({ editor }: IQuoteButton) => {
  return (
    <ToolbarButton
      handleClick={() => {
        editor.chain().focus().toggleBlockquote().run();
      }}
      isActive={editor?.isActive("blockquote")}
    >
      <BlockQuoteIcon />
    </ToolbarButton>
  );
};

interface ITextSizeDropdown extends ITipTapToolbar {}
export const TextSizeDropdown = ({ editor }: ITextSizeDropdown) => {
  const getSelectedHeadingValue = () => {
    if (editor?.isActive("heading")) {
      return "h" + editor.getAttributes("heading").level;
    }
    return "normal";
  };

  const handleHeadingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = event.target.value;
    if (newLevel === "normal") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level: any = parseInt(newLevel.replace("h", ""), 10);
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };
  return (
    <select
      value={getSelectedHeadingValue()}
      onChange={handleHeadingChange}
      className="text-[14px] bg-transparent"
    >
      <option value="normal">Normal text</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>
  );
};

export const AlignmentDropdown = ({ editor }: ITextSizeDropdown) => {
  const alignmentItems = [
    {
      label: "Left",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      activeCheck: { textAlign: "left" },
      icon: <AlignLeft />,
    },
    {
      label: "Center",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      activeCheck: { textAlign: "center" },
      icon: <AlignCenter />,
    },
    {
      label: "Right",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      activeCheck: { textAlign: "right" },
      icon: <AlignRight />,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="p-1 rounded-lg flex items-center"
        ref={ref}
      >
        {editor?.isActive({ textAlign: "left" })
          ? alignmentItems[0].icon
          : editor?.isActive({ textAlign: "center" })
          ? alignmentItems[1].icon
          : alignmentItems[2].icon}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white shadow-md rounded-lg mt-1">
          {alignmentItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className={`block px-3 py-2 text-left w-full ${
                editor?.isActive(item.activeCheck)
                  ? "bg-sky-700 text-white"
                  : ""
              } hover:bg-sky-700 hover:text-white`}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

type ColorDropdownProps = {
  editor: Editor;
};

const ColorDropdown: React.FC<ColorDropdownProps> = ({ editor }) => {
  const [color, setColor] = useState("#000000");

  // Handle color change
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    editor.chain().focus().setColor(newColor).run();
  };

  // Simulate click on the hidden color input

  return (
    <div className="flex items-center">
      <input
        type="color"
        value={color}
        onChange={handleColorChange}
        className="w-[28px] border-none"
        id="text-color"
      />
      <label htmlFor="text-color">
        <ChevronDown className="w-4 h-4 ml-1" />
      </label>
    </div>
  );
};
