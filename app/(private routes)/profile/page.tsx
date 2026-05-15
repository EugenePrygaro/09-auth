import Link from "next/link";
import css from "./Profile.module.css";
import { Metadata } from "next";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "NoteHub Profile",
  description:
    "View and manage your profile on NoteHub, your personal note management app.",
  openGraph: {
    title: "NoteHub Profile",
    description:
      "View and manage your profile on NoteHub, your personal note management app.",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - Your Personal Note Management App",
      },
    ],
  },
};

export default async function Profile() {
  const user = await getMe();
  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src={user?.avatar || ""}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user?.username}</p>
            <p>Email: {user?.email || "your_email@example.com"}</p>
          </div>
        </div>
      </main>
    </>
  );
}
