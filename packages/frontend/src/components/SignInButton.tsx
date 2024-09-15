'use client';
import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <>
      <button onClick={() => signIn("google", { callbackUrl: window.origin }, { prompt: 'login' })}>
        сменить аккаунт
      </button>
    </>
  );
}
