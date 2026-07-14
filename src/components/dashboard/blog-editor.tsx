"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { uploadImage } from "@/lib/gallery";
import { resolveMediaInHtml } from "@/lib/media-url";

function ImageComponent({ node, updateAttributes, selected }: any) {
  const { src, alt, title } = node.attrs;
  return (
    <NodeViewWrapper className={`blog-editor__image-wrapper ${selected ? "is-selected" : ""}`}>
      <img src={src} alt={alt} title={title} className="blog-content__image" />
      <input
        type="text"
        contentEditable={false}
        className="blog-editor__image-caption-input mono"
        placeholder="Type caption for image (optional)…"
        value={alt || ""}
        onChange={(e) => {
          updateAttributes({ alt: e.target.value, title: e.target.value });
        }}
      />
    </NodeViewWrapper>
  );
}

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});

type BlogEditorProps = {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

type ToolbarButton = {
  label: string;
  title: string;
  action: () => void;
  active?: boolean;
};

export default function BlogEditor({
  content,
  onChange,
  disabled = false,
}: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertImageRef = useRef<(file: File) => Promise<void>>(async () => {});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: "blog-content__image",
          loading: "lazy",
        },
      }),
      Placeholder.configure({
        placeholder: "Tell your story…",
      }),
    ],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "blog-editor__content",
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const image = Array.from(files).find((file) =>
          file.type.startsWith("image/")
        );
        if (!image) return false;
        event.preventDefault();
        void insertImageRef.current(image);
        return true;
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              void insertImageRef.current(file);
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
  });

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      setUploading(true);
      setUploadError("");

      try {
        const { url } = await uploadImage(file);
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt, title: alt })
          .run();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Image upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor]
  );

  insertImageRef.current = insertImage;

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(
        resolveMediaInHtml(content || "<p></p>"),
        { emitUpdate: false }
      );
    }
  }, [content, editor]);

  if (!editor) {
    return <p className="dashboard-muted">Loading editor…</p>;
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const buttons: ToolbarButton[] = [
    {
      label: "B",
      title: "Bold",
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "I",
      title: "Italic",
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "U",
      title: "Underline",
      active: editor.isActive("underline"),
      action: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "H2",
      title: "Heading 2",
      active: editor.isActive("heading", { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      title: "Heading 3",
      active: editor.isActive("heading", { level: 3 }),
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "❝",
      title: "Quote",
      active: editor.isActive("blockquote"),
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "•",
      title: "Bullet list",
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "1.",
      title: "Numbered list",
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "</>",
      title: "Code block",
      active: editor.isActive("codeBlock"),
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "—",
      title: "Divider",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      label: "Link",
      title: "Add link",
      active: editor.isActive("link"),
      action: setLink,
    },
  ];

  return (
    <div className="blog-editor">
      <div className="blog-editor__toolbar" role="toolbar" aria-label="Formatting">
        {buttons.map((button) => (
          <button
            key={button.title}
            type="button"
            className={`blog-editor__tool${button.active ? " is-active" : ""}`}
            title={button.title}
            disabled={disabled || uploading}
            onClick={button.action}
          >
            {button.label}
          </button>
        ))}
        <button
          type="button"
          className="blog-editor__tool blog-editor__tool--accent"
          title="Insert image"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "…" : "Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void insertImage(file);
          }}
        />
      </div>

      <EditorContent editor={editor} />

      <p className="blog-editor__hint mono">
        Drag, paste, or use Image to embed anywhere in your post.
      </p>
      {uploadError ? <p className="dashboard-form__error">{uploadError}</p> : null}
    </div>
  );
}
