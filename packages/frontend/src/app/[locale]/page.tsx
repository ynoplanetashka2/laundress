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
import { Box, Card } from '@mui/material';
import { isNil } from 'lodash';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isAdmin = accounts
    .filter(({ priviledge }) => priviledge === 'admin')
    .map(({ email }) => email)
    .includes(email);
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
    </>
  );
}
