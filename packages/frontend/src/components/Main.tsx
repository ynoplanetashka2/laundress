import SignInButton from './SignInButton';
import GoogleAccountInfo from './GoogleAccountInfo';
import LanguageSelect from './LanguageSelect';
import { getAccounts } from '@/api/getAccounts';
import { getServerSession } from 'next-auth';
import { isNil } from 'lodash';
import { Card } from '@mui/material';
import { getBookings } from '@/api/getBookings';
import WashingMachineTablesTabs from './WashingMachineTablesTabs';
import { getWashingMachines } from '@/api/getWashingMachines';
import type { Booking } from '@/schemas/Booking';

export default async function Main() {
  const [session, accounts] = await Promise.all([
    await getServerSession(),
    await getAccounts(),
  ]);
  const email = session?.user?.email;
  if (isNil(email)) {
    throw new Error('user has no email');
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
    <div
      style={{
        maxWidth: '800px',
        width: '80vw',
        margin: '0 auto',
      }}
      className="bg-cyan-100 px-10 py-3"
    >
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
    </div>
  );
}
