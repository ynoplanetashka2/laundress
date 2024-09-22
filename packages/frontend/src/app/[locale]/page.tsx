import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import { getAccounts } from '@/api/getAccounts';
import { getBookings } from '@/api/getBookings';
import { getWashingMachines } from '@/api/getWashingMachines';
import GoogleAccountInfo from '@/components/GoogleAccountInfo';
import LanguageSelect from '@/components/LanguageSelect';
import SignInButton from '@/components/SignInButton';
import WashingMachineTablesTabs from '@/components/WashingMachineTablesTabs';
import type { Booking } from '@/schemas/Booking';
import { Card } from '@mui/material';
import { isNil, uniqBy } from 'lodash';
import AdminTools from '@/components/AdminTools';
import { updateAccounts } from '@/api/updateAccounts';
import type { Account } from '@/schemas/Account';
import { updateWashingMachines } from '@/api/updateWashingMachines';
import type { WashingMachine } from '@/schemas/WashingMachine';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  const email = session?.user?.email;
  if (isNil(email)) {
    redirect('/en/forbidden');
  }
  const accounts = await getAccounts();
  const isInWhiteList = accounts.map(({ email }) => email).includes(email);
  if (!isInWhiteList) {
    redirect('/en/forbidden');
  }
  const bookings = await getBookings();
  const washingMachines = await getWashingMachines();
  const groupedBookings = {
    ...(Object.groupBy(
      bookings,
      ({ washingMachineId }) => washingMachineId,
    ) as Record<string, Booking[]>),
  };
  const userAccountsEmails = accounts
    .filter(({ priviledge }) => priviledge === 'user')
    .map(({ email }) => email);
  const adminAccountsEmails = accounts
    .filter(({ priviledge }) => priviledge === 'admin')
    .map(({ email }) => email);
  const isAdmin = adminAccountsEmails.includes(email);
  const washingMachinesLabels = washingMachines.map(({ label }) => label);
  async function handleAdminAcconutsEmailsUpdate(newEmails: string[]) {
    'use server';
    return await updateAccounts(
      uniqBy(
        [
          ...newEmails.map<Account>((email) => ({
            email,
            priviledge: 'admin',
          })),
          ...accounts,
        ],
        ({ email }) => email,
      ),
    );
  }
  async function handleUserAcconutsEmailsUpdate(newEmails: string[]) {
    'use server';
    return await updateAccounts(
      uniqBy(
        [
          ...newEmails.map<Account>((email) => ({ email, priviledge: 'user' })),
          ...accounts,
        ],
        ({ email }) => email,
      ),
    );
  }
  async function handleWashingMachinesLabelsUpdate(newLabels: string[]) {
    'use server';
    return await updateWashingMachines(
      uniqBy(
        [
          ...newLabels.map<WashingMachine>((label) => ({ label, _id: label })),
          ...washingMachines,
        ],
        ({ label }) => label,
      ),
    );
  }
  return (
    <>
      <div className="w-20">
        <LanguageSelect />
      </div>
      <Card variant="elevation" className="w-min p-3 my-2 mx-auto">
        <GoogleAccountInfo />
        <div className="flex justify-center my-2">
          <SignInButton />
        </div>
      </Card>
      <WashingMachineTablesTabs
        machineBookings={groupedBookings}
        washingMachines={washingMachines}
      />
      {isAdmin ? (
        <AdminTools
          adminAccountsEmails={adminAccountsEmails}
          userAccountsEmails={userAccountsEmails}
          washingMachinesLabels={washingMachinesLabels}
          onAdminAccountsEmailsUpdate={handleAdminAcconutsEmailsUpdate}
          onUserAccountsEmailsUpdate={handleUserAcconutsEmailsUpdate}
          onWashingMachinesLabelsUdate={handleWashingMachinesLabelsUpdate}
        />
      ) : null}
    </>
  );
}
