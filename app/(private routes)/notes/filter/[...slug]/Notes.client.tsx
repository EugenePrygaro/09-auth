"use client";

import css from "./NotesPage.module.css";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { fetchNotes } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";

interface NotesClientProps {
  tag: string;
}
export default function NoteClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const isAll: boolean = tag === "all";
  const queryKey = isAll
    ? ["notes", currentPage, search]
    : ["notes", currentPage, search, tag];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNotes(currentPage, 12, search, isAll ? undefined : tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    },
    300,
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox defaultValue={search} onChange={updateSearchQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={currentPage - 1}
            onPageChange={(page) => setCurrentPage(page + 1)}
          ></Pagination>
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {isLoading && <Loader />}
      {isError && <p className={css.error}>Error fetching notes</p>}
      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes as Note[]} />
      ) : (
        <p className={css.noNotes}>No notes found</p>
      )}
    </div>
  );
}
