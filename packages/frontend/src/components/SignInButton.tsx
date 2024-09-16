'use client';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function SignInButton() {
  const t = useTranslations('Auth');
  return (
    <>
      <Button variant='outlined' onClick={() => signIn("google", { callbackUrl: window.origin }, { prompt: 'login' })}>
        { t('changeAccount') }
      </Button>
    </>
  );
}
