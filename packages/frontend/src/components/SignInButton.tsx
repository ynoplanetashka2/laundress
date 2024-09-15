'use client';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function SignInButton() {
  const t = useTranslations('Auth');
  return (
    <>
      <button onClick={() => signIn("google", { callbackUrl: window.origin }, { prompt: 'login' })}>
        { t('changeAccount') }
      </button>
    </>
  );
}
