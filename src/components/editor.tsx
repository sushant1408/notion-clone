"use client";

import { codeBlockOptions } from "@blocknote/code-block";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  createCodeBlockSpec,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  PartialBlock,
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { useTheme } from "next-themes";

import { useEdgeStore } from "@/lib/edgestore";
import { Doc } from "../../convex/_generated/dataModel";
import { Mention } from "./mention";

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    // Adds all default inline content.
    ...defaultInlineContentSpecs,
    // Adds the mention tag.
    mention: Mention,
  },
}).extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec(codeBlockOptions),
  },
});

const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  const users = ["Steve", "Bob", "Joe", "Mike"];
  return users.map((user) => ({
    title: user,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user,
          },
        },
        " ", // add a space after the mention
      ]);
    },
  }));
};

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: Doc<"documents">["content"];
  editable?: boolean;
}

const Editor = ({ initialContent, onChange, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });

    return res.url;
  };

  // @ts-expect-error type mismatch but works
  const editor: BlockNoteEditor = useCreateBlockNote({
    schema,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <SuggestionMenuController
        triggerCharacter="@"
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(
            getMentionMenuItems(editor as typeof schema.BlockNoteEditor),
            query
          )
        }
      />
    </BlockNoteView>
  );
};

export default Editor;
