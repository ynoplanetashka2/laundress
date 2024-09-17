'use client';
import { SUPPORTED_LOCALES, usePathname, useRouter } from '@/i18n/routing';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useLocale } from 'next-intl';
import { useId, useTransition } from 'react';

export default function LanguageSelect() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const id = useId();
  const languageSelectId = `language-select-${id}`;

  function handleChange(event: SelectChangeEvent<string>) {
    const nextLocale = event.target.value as (typeof SUPPORTED_LOCALES)[number];
    startTransition(() => {
      router.push(pathname, {
        locale: nextLocale,
      });
    });
  }
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={languageSelectId}> language </InputLabel>
      <Select<string>
        id={languageSelectId}
        value={locale}
        variant="filled"
        label="language"
        onChange={handleChange}
        disabled={isPending}
      >
        {SUPPORTED_LOCALES.map((loc) => (
          <MenuItem key={loc} value={loc}>
            {loc}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
