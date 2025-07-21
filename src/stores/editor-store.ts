// stores/editorStore.ts
import type { editor } from "monaco-editor"
import { create } from "zustand"

interface EditorStore {
  editorRef: editor.IStandaloneCodeEditor | null
  setEditorRef: (editor: editor.IStandaloneCodeEditor) => void
}

export const useEditorStore = create<EditorStore>(set => ({
  editorRef: null,
  setEditorRef: editor => set({ editorRef: editor }),
}))
