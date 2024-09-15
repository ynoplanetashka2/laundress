'use client';
import { SUPPORTED_LOCALES, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useTransition, type ChangeEvent } from 'react';

export default function LanguageSelect() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as (typeof SUPPORTED_LOCALES)[number];
    startTransition(() => {
      router.push(pathname, {
        locale: nextLocale,
      });
    });
  }
  return (
    <select defaultValue={locale} onChange={handleChange} disabled={isPending}>
      {SUPPORTED_LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {loc}
        </option>
      ))}
    </select>
  );
}
