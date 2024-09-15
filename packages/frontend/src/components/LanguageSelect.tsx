'use client';
import { routing, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useParams,  } from 'next/navigation';
import { format } from 'node:url';
import { useTransition, type ChangeEvent } from 'react';

export default function LanguageSelect() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.push(
        pathname,
        {
          locale: nextLocale as any,
        }
      );
    });
  }
  return (
    <select defaultValue={locale} onChange={handleChange} disabled={isPending}>
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc}
        </option>
      ))}
    </select>
  );
}
