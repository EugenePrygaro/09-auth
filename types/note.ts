export enum NoteTag {
    Work = "Work",
    Personal = "Personal",
    Meeting = "Meeting",
    Shopping = "Shopping",
    Todo = "Todo",
}

export interface Note {
    id: string;
    title: string;
    content: string;
    tag: NoteTag;
    createdAt: string
    updatedAt: string
}

export interface NewNoteData {
    title: string;
    content: string;
    tag: NoteTag;
}