"use client";

import css from "./NoteForm.module.css";
import { useId } from "react";
import { NoteTag, type NewNoteData } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const draft = useNoteStore((state) => state.draft);
  const changeDraft = useNoteStore((state) => state.changeDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleCreateNote = async (noteData: NewNoteData) => {
    createNoteMutation.mutate(noteData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    changeDraft({ ...draft, [name]: value });
  };

  const handleCancel = () => router.push("/notes/filter/all");

  const handleSubmit = (formData: FormData) => {
    const noteData = Object.fromEntries(formData);
    const title = noteData.title as string;
    const content = noteData.content as string;
    const tagValue = noteData.tag as NoteTag;
    const newNoteData: NewNoteData = { title, content, tag: tagValue };
    handleCreateNote(newNoteData);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`title-${fieldId}`}>Title</label>
        <input
          id={`title-${fieldId}`}
          name="title"
          className={css.input}
          value={draft?.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`content-${fieldId}`}>Content</label>
        <textarea
          id={`content-${fieldId}`}
          name="content"
          rows={8}
          className={css.textarea}
          value={draft?.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`tag-${fieldId}`}>Tag</label>
        <select
          id={`tag-${fieldId}`}
          name="tag"
          className={css.select}
          value={draft?.tag}
          onChange={handleChange}
        >
          <option value={NoteTag.Todo}>Todo</option>
          <option value={NoteTag.Work}>Work</option>
          <option value={NoteTag.Personal}>Personal</option>
          <option value={NoteTag.Meeting}>Meeting</option>
          <option value={NoteTag.Shopping}>Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={false}>
          Create note
        </button>
      </div>
    </form>
  );
}
