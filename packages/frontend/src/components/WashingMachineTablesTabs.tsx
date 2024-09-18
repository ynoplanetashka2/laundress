'use client';

import type { Booking } from '@/schemas/Booking';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import { Box, Card, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import { type WashingMachine } from '@/schemas/WashingMachine';
import Timetable from './Timetable';
import { groupBy, mapValues, uniq, values } from 'lodash';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { BookingForm } from './BookingForm';
import { bookMachineTime } from '@/api/bookMachineTime';
import { useSession } from 'next-auth/react';
import { deleteBooking } from '@/api/deleteBooking';

type MachinesBookings = {
  [machineId in string]: Booking[];
};

type Props = {
  machineBookings: MachinesBookings;
  washingMachines: WashingMachine[];
};

const WEEKDAY_NUMBER_TO_NAME = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
} as const;
type WEEKDAY_NUMBER = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const WEEKDAYS_NAMES = values(WEEKDAY_NUMBER_TO_NAME);

function bookingsToTimetableParams(
  bookings: Booking[],
  userEmail?: string | undefined,
) {
  function getWeekday(date: Date) {
    return DateTime.fromJSDate(date, { zone: 'UTC+3' }).weekday;
  }
  function generateLabel(
    firstname: string,
    lastname: string,
    roomNumber: string,
  ) {
    return `${lastname} ${firstname} ${roomNumber}`;
  }
  const days = uniq(bookings.map(({ fromTime }) => getWeekday(fromTime)))
    .toSorted()
    .map((dayNumber) => WEEKDAY_NUMBER_TO_NAME[dayNumber as WEEKDAY_NUMBER]);
  const events = mapValues(
    groupBy(
      bookings,
      ({ fromTime }) =>
        WEEKDAY_NUMBER_TO_NAME[getWeekday(fromTime) as WEEKDAY_NUMBER],
    ),
    (bookingsAtDay) => {
      return bookingsAtDay.map(
        ({
          fromTime,
          upToTime,
          firstname,
          lastname,
          roomNumber,
          bookedUserEmail,
          _id,
        }) => ({
          startTime: fromTime,
          endTime: upToTime,
          label: generateLabel(firstname, lastname, roomNumber),
          isRemovable: userEmail === bookedUserEmail,
          id: _id,
        }),
      );
    },
  );
  return {
    events,
    daysOrder: days,
  };
}

export default function WashingMachineTablesTabs({
  machineBookings,
  washingMachines,
}: Props) {
  const machineIds = washingMachines.map(({ _id: machineId }) => machineId);
  if (machineIds.length === 0) {
    throw new Error('can not have 0 washing machines');
  }
  const [currentMachineId, setCurrentMachineId] = useState(machineIds.at(0)!);
  const translateTimetable = useTranslations('Timetable');
  const translateBooking = useTranslations('Booking');
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const daysLabels = Object.fromEntries(
    WEEKDAYS_NAMES.map((weekdayName) => [
      weekdayName,
      translateTimetable(weekdayName),
    ]),
  );

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={currentMachineId}>
        <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
          <TabList
            onChange={(_, newCurrentMachineId) =>
              setCurrentMachineId(newCurrentMachineId)
            }
          >
            {washingMachines.map(({ _id: machineId, label }) => (
              <Tab key={machineId} label={label} value={machineId} />
            ))}
          </TabList>
        </Box>
        {washingMachines.map(({ _id: machineId }) => {
          const bookings = machineBookings[machineId];
          const { daysOrder, events } =
            bookings !== undefined
              ? bookingsToTimetableParams(bookings, userEmail ?? undefined)
              : {
                  daysOrder: [],
                  events: {},
                };

          return (
            <TabPanel value={machineId} key={machineId}>
              {bookings !== undefined ? (
                <Timetable
                  style={{
                    width: '100%',
                  }}
                  events={events}
                  daysOrder={daysOrder as string[]}
                  daysLabels={daysLabels}
                  timeColumnHeader={translateTimetable('time')}
                  onDeleteEventClick={deleteBooking}
                />
              ) : (
                <Typography variant="body1">
                  {translateBooking('noBookings')}
                </Typography>
              )}
              <Card variant="elevation" className="mt-3 p-2">
                <BookingForm
                  onSubmit={bookMachineTime}
                  washingMachineId={machineId}
                />
              </Card>
            </TabPanel>
          );
        })}
      </TabContext>
    </Box>
  );
}
