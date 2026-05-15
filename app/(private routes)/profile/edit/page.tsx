"use client";

import css from "./EditProfile.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import { updateMe } from "@/lib/api/clientApi";
import { type logErrorResponse } from "@/app/api/_utils/utils";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const formValues = Object.fromEntries(formData);
    const username = formValues.username as string;
    const email = user?.email;
    try {
      console.log("Updating profile with:", { username, email });
      const res = await updateMe({ username, email });
      console.log(res);
      alert("Profile updated successfully!");
      setUser(res);
    } catch (err) {
      const errorData = (err as logErrorResponse)?.response?.data?.response;
      const errorMessage =
        errorData?.validation?.body?.message ||
        errorData?.message ||
        (err as { message?: string })?.message ||
        "Oops... some error";
      alert(`Failed to update profile: ${errorMessage}`);
    }
  };

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>

          <Image
            src={user?.avatar || ""}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />

          <form className={css.profileInfo} action={handleSubmit}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username:</label>
              <input
                name="username"
                type="text"
                className={css.input}
                defaultValue={user?.username}
              />
            </div>

            <p>Email: {user?.email}</p>

            <div className={css.actions}>
              <button type="submit" className={css.saveButton}>
                Save
              </button>
              <button
                type="button"
                className={css.cancelButton}
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
