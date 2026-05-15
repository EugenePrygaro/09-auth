import type { Note, NewNoteData } from "@/types/note";
import { User } from '@/types/user';
import nextServer from "./api";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface MutateNoteResponse {
  note: Note;
}

export const fetchNotes = async (
  currentPage: number,
  perPage: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>(`/notes`, {
    params: {
      page: currentPage,
      perPage: perPage,
      search: search,
      tag: tag,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`, {
  });
  return response.data;
};

export const createNote = async (
  noteData: NewNoteData
): Promise<MutateNoteResponse> => {
  const response = await nextServer.post<MutateNoteResponse>(
    `/notes`,
    noteData,
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<MutateNoteResponse> => {
  const response = await nextServer.delete<MutateNoteResponse>(`/notes/${id}`, {
  });
  return response.data;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};



export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (credentials: LoginRequest) => {
  const response = await nextServer.post(`/auth/login`, credentials);
  return response.data;
};

export const logout = async () => {
  const response = await nextServer.post(`/auth/logout`);
  return response.data;
};

export const checkSession = async () => {
  const response = await nextServer.get(`/auth/session`);
  return response.data;
};

export const getMe = async () => {
  const response = await nextServer.get(`/users/me`);
  return response.data;
};

export type UpdateMeRequest = {
  email?: string;
  username?: string;
};

export const updateMe = async (updateData: UpdateMeRequest) => {
  const response = await nextServer.patch(`/users/me`, updateData);
  return response.data;
};
