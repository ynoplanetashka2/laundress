import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { getAccounts } from "@/api/getAccounts";
import { getBookings } from "@/api/getBookings";
import { getWashingMachines } from "@/api/getWashingMachines";
import GoogleAccountInfo from "@/components/GoogleAccountInfo";
import LanguageSelect from "@/components/LanguageSelect";
import SignInButton from "@/components/SignInButton";
import WashingMachineTablesTabs from "@/components/WashingMachineTablesTabs";
import type { Booking } from "@/schemas/Booking";
import { Box, Card } from "@mui/material";
import { isNil } from "lodash";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  const accounts = await getAccounts();
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
    <Box
      sx={{
        maxWidth: '800px',
        width: {
          md: '80vw',
          sm: '100vw',
        },
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
    </Box>
  );
}