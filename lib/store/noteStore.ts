import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NoteTag, type NewNoteData } from "../../types/note";

type NoteStore = {
  draft: NewNoteData,
    changeDraft: (note: NewNoteData) => void,
    clearDraft: () => void;
};
const initialDraft: NewNoteData = {
  title: '',
  content: '',
  tag: NoteTag.Todo,
};

export const useNoteStore = create<NoteStore>()(
    persist((set) => ({
        draft: initialDraft,
        changeDraft: (note) => set({ draft: note }),
        clearDraft: () => set({ draft: initialDraft }),
    }), {
        name: 'note-draft',
    })
);

