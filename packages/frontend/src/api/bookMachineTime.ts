'use server';

import { getServerSession } from 'next-auth';
import { getAccounts } from './getAccounts';
import { BookingSchema, type Booking } from '@/schemas/Booking';
import { getWashingMachines } from './getWashingMachines';
import { executeMongo } from './executeMongo';
import { randomUUID } from 'node:crypto';
import { DateTime } from 'luxon';
import { inRange } from 'lodash';
import { getBookings } from './getBookings';

export async function bookMachineTime(
  booking: Omit<Booking, 'bookedUserEmail' | '_id' | 'expireAt'>,
): Promise<{ error?: string }> {
  const parseResult = BookingSchema.omit({
    bookedUserEmail: true,
    _id: true,
    expireAt: true,
  })
    .refine(
      ({ fromTime, upToTime }) =>
        new Date(upToTime).getTime() >= new Date(fromTime).getTime(),
      {
        message: 'upToTime can not be less than fromTime',
      },
    )
    .refine(
      ({ roomNumber }) =>
        roomNumber.split('').every((digit) => !isNaN(Number(digit))),
      {
        message: 'wrong room number',
      },
    )
    .safeParse(booking);
  if (parseResult.error) {
    return { error: parseResult.error.toString() };
  }

  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) {
    return { error: 'email not specified' };
  }

  const accounts = await getAccounts();
  const emails = accounts.map(({ email }) => email);
  if (!emails.includes(email)) {
    return { error: 'forbidden' };
  }

  const washingMachines = await getWashingMachines();
  const washingMachinesIds = washingMachines.map(({ _id: id }) => id);

  const {
    washingMachineId,
    fromTime,
    upToTime,
    firstname: firstName,
    lastname: lastName,
    roomNumber,
  } = booking;
  if (!washingMachinesIds.includes(washingMachineId)) {
    return { error: 'invalid washing machine id' };
  }

  const ONE_HOUR = 60 * 60 * 1_000;
  const ONE_DAY = 24 * ONE_HOUR;
  const MAX_BOOK_IN_ADVANCE = ONE_DAY;
  const MAX_BOOK_DURATION = 5 * ONE_HOUR;
  const MIN_BOOK_DURATION = 0.5 * ONE_HOUR;
  const fromLuxonTime = DateTime.fromJSDate(fromTime);
  const upToLuxonTime = DateTime.fromJSDate(upToTime);
  if (upToLuxonTime.toMillis() < fromLuxonTime.toMillis()) {
    return { error: 'bookEndTimeLessThanBookStartTimeError' };
  }
  if (upToLuxonTime.diff(fromLuxonTime).toMillis() <= MIN_BOOK_DURATION) {
    return { error: 'bookTooShortError' };
  }
  if (upToLuxonTime.diff(fromLuxonTime).toMillis() > MAX_BOOK_DURATION) {
    return { error: 'bookTooLongError' };
  }
  if (upToLuxonTime.diffNow().toMillis() > MAX_BOOK_IN_ADVANCE) {
    return { error: 'bookInTooAdvanceError' };
  }
  if (fromLuxonTime.toMillis() < DateTime.now().toMillis()) {
    return { error: 'bookInThePastError' };
  }
  if (
    inRange(fromLuxonTime.setZone('UTC+3').hour, 0, 7) ||
    inRange(upToLuxonTime.setZone('UTC+3').hour, 0, 7)
  ) {
    return { error: 'bookInNotWorkingIntervalError' };
  }
  
  const bookings = await getBookings();
  const bookingsForMachine = bookings.filter(({ washingMachineId: machineId }) => washingMachineId === machineId);
  const sortedBookings = bookingsForMachine.toSorted(({ fromTime: fromTime1, }, { fromTime: fromTime2, }) => fromTime1.getTime() - fromTime2.getTime());
  const correspondingToNewBookingIndex = sortedBookings.findIndex(({ fromTime: bookingFromTime }) => bookingFromTime.getTime() > fromTime.getTime());
  let isTimeAlreadyReserved = false;
  timeNotReservedLabel: { 
    if (sortedBookings.length === 0) {
      break timeNotReservedLabel;
    }
    if (correspondingToNewBookingIndex !== -1) {
      if (upToTime.getTime() > sortedBookings[correspondingToNewBookingIndex].fromTime.getTime()) {
        isTimeAlreadyReserved = true;
        break timeNotReservedLabel;
      }
      if (correspondingToNewBookingIndex > 0) {
        if (sortedBookings[correspondingToNewBookingIndex - 1].upToTime.getTime() > fromTime.getTime()) {
          isTimeAlreadyReserved = true;
          break timeNotReservedLabel;
        }
      }
    }
    else {
      if (sortedBookings[sortedBookings.length - 1].upToTime.getTime() > fromTime.getTime()) {
        isTimeAlreadyReserved = true;
        break timeNotReservedLabel;
      }
    }
  }
  if (isTimeAlreadyReserved) {
    return { error: 'bookTimeAlreadyReservedError' };
  }

  return await executeMongo(async (db) => {
    const collection = db.collection<Booking>('booking');
    const uuid = randomUUID({ disableEntropyCache: true });
    const ONE_DAY = 24 * 60 * 60 * 1_000;
    await collection.insertOne({
      _id: uuid,
      washingMachineId,
      fromTime: new Date(fromTime),
      upToTime: new Date(upToTime),
      firstname: firstName,
      lastname: lastName,
      roomNumber,
      bookedUserEmail: email,
      expireAt: new Date(new Date(upToTime).getTime() + ONE_DAY),
    });
    return {};
  });
}
