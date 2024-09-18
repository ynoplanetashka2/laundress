'use client';
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useLocale } from "next-intl";

type Props = {
  children: React.ReactNode;
  session: Session | null;
}
export default function ContextProviders({ children, session }: Props) {
  const locale = useLocale();
  return (
    <SessionProvider session={session}>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
        { children }
      </LocalizationProvider>
    </SessionProvider>
  )
}