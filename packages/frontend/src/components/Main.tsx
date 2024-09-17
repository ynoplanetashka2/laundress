import Timetable from './Timetable';
import TabContext from '@mui/lab/TabContext';
import SignInButton from './SignInButton';
import GoogleAccountInfo from './GoogleAccountInfo';
import LanguageSelect from './LanguageSelect';
import { getAccounts } from '@/api/getAccounts';
import { getTranslations } from 'next-intl/server';
import TagsEditList from './TagsEditList';
import { getServerSession } from 'next-auth';
import { isNil } from 'lodash';
import { Box, Card } from '@mui/material';
import { BookingForm } from './BookingForm';
import { bookMachineTime } from '@/api/bookMachineTime';
import { getBookings } from '@/api/getBookings';
import WashingMachineTablesTabs from './WashingMachineTablesTabs';
import { getWashingMachines } from '@/api/getWashingMachines';
import type { WashingMachine } from '@/schemas/WashingMachine';
import type { Booking } from '@/schemas/Booking';

export default async function Main() {
  const t = await getTranslations('Timetable');
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
