'use client';

import type { Booking } from '@/schemas/Booking';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import { Box, Tab } from '@mui/material';
import { useState } from 'react';
import {
  WashingMachineSchema,
  type WashingMachine,
} from '@/schemas/WashingMachine';
import Timetable from './Timetable';
import { groupBy, mapValues, uniq } from 'lodash';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';

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

function bookingsToTimetableParams(bookings: Booking[]) {
  function getWeekday(date: Date) {
    return DateTime.fromJSDate(date, { zone: 'UTC+3' }).weekday;
  }
  function generateLabel(
    firstname: string,
    lastname: string,
    roomNumber: string,
  ) {
    return `${lastname} ${firstname}\n ${roomNumber}`;
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
        ({ fromTime, upToTime, firstname, lastname, roomNumber }) => ({
          startTime: fromTime,
          endTime: upToTime,
          label: generateLabel(firstname, lastname, roomNumber),
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
  const machineIds = Object.keys(machineBookings);
  if (machineIds.length === 0) {
    throw new Error('can not have 0 washing machines');
  }
  const [currentMachineId, setCurrentMachineId] = useState(machineIds.at(0)!);
  const t = useTranslations('Timetable');

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={currentMachineId}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(_, newCurrentMachineId) =>
              setCurrentMachineId(newCurrentMachineId)
            }
            aria-label="lab API tabs example"
          >
            {washingMachines.map(({ _id: machineId, label }) => (
              <Tab key={machineId} label={label} value={machineId} />
            ))}
          </TabList>
        </Box>
        {washingMachines.map(({ _id: machineId }) => {
          const bookings = machineBookings[machineId];
          const { daysOrder, events } = bookingsToTimetableParams(bookings);
          return (
            <TabPanel value={machineId} key={machineId}>
              <Timetable
                style={{
                  height: '500px',
                  width: '100%',
                }}
                events={events}
                daysOrder={daysOrder as string[]}
                timeColumnHeader={t('time')}
              />
            </TabPanel>
          );
        })}
      </TabContext>
    </Box>
  );
}
