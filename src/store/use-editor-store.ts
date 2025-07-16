// editoru merkezi yerde saklamak için

import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void;
};

// useEditorStore adında bir custom hook olusturduk.
// baslangıcta editorun değeri null, editorden değiştirildiğinde burda sete girer ve değişir.
export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
}));
