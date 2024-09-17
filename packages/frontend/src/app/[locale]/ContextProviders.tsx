'use client';
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SessionProvider } from "next-auth/react";
import { useLocale } from "next-intl";

type Props = {
  children: React.ReactNode;
}
export default function ContextProviders({ children }: Props) {
  const locale = useLocale();
  return (
    <SessionProvider>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
        { children }
      </LocalizationProvider>
    </SessionProvider>
  )
}