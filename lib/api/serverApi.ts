import type { Note, NewNoteData } from "@/types/note";
import nextServer from "./api";
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  currentPage: number,
  perPage: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
    const cookieStore = await cookies();
  const response = await nextServer.get<FetchNotesResponse>(`/notes`, {
    params: {
      page: currentPage,
      perPage: perPage,
      search: search,
      tag: tag,
    },
    headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
        Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};
export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<User>(`/users/me`, {
    headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
            Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const checkSession = async () : Promise<AxiosResponse> => {
  const cookieStore = await cookies();
  const response = await nextServer.get(`/auth/session`, {
    headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
            Cookie: cookieStore.toString(),
    },
  });
  return response;
};
