'use client';

import { Box } from "@mui/material";
import TagsEditList from "./TagsEditList";

type Props = {
  adminAccountsEmails: string[];
  userAccountsEmails: string[];
  washingMachinesLabels: string[];
  onAdminAccountsEmailsUpdate: (emails: string[]) => void;
  onUserAccountsEmailsUpdate: (emails: string[]) => void;
  onWashingMachinesLabelsUdate: (washingMachinesLabels: string[]) => void;
};

export default function AdminTools({ adminAccountsEmails, onAdminAccountsEmailsUpdate, onUserAccountsEmailsUpdate, onWashingMachinesLabelsUdate, userAccountsEmails, washingMachinesLabels }: Props) {
  return (
    <Box className='flex flex-col gap-4'>
      <TagsEditList label='аккаунты администраторов' tags={adminAccountsEmails} onSave={onAdminAccountsEmailsUpdate}/>
      <TagsEditList label='аккаунты обычных пользователей' tags={userAccountsEmails} onSave={onUserAccountsEmailsUpdate}/>
      <TagsEditList label='названия стиральных машинок' tags={washingMachinesLabels} onSave={onWashingMachinesLabelsUdate}/>
    </Box>
  )
}