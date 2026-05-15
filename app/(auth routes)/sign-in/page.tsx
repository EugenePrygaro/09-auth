"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { login, LoginRequest } from "@/lib/api/clientApi";
import css from "./Login.module.css";
import { type logErrorResponse } from "@/app/api/_utils/utils";

export default function Login() {
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;
      const res = await login(formValues);
      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      const errorData = (err as logErrorResponse)?.response?.data?.response;
      console.log(errorData);
      const errorMessage =
        errorData?.validation?.body?.message ||
        errorData?.message ||
        (err as { message?: string })?.message ||
        "Oops... some error";

      setError(errorMessage);
    }
  };
  return (
    <>
      <main className={css.mainContent}>
        <form className={css.form} action={handleSubmit}>
          <h1 className={css.formTitle}>Sign in</h1>

          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={css.input}
              required
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={css.input}
              required
            />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton}>
              Log in
            </button>
          </div>

          <p className={css.error}>{error}</p>
        </form>
      </main>
    </>
  );
}
