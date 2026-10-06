"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { btnPrimary, inputClass, labelClass } from "@/lib/ui";

const initial: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p role="alert" className="rounded-xl bg-cream px-3 py-2 text-sm font-semibold">
          {state.error}
        </p>
      ) : null}
      <label className="block">
        <span className={labelClass}>Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      <button type="submit" className={`${btnPrimary} w-full`} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
