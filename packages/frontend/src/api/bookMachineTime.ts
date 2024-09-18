'use server';

import { getServerSession } from 'next-auth';
import { getAccounts } from './getAccounts';
import { BookingSchema, BookingSerializableSchema, type Booking, type BookingSerializable } from '@/schemas/Booking';
import { getWashingMachines } from './getWashingMachines';
import { executeMongo } from './executeMongo';
import { randomUUID } from 'node:crypto';

export async function bookMachineTime(
  booking: Omit<Booking, 'bookedUserEmail' | '_id'>
) {
  BookingSchema.omit({ bookedUserEmail: true, _id: true, })
    .refine(
      ({ fromTime, upToTime }) => new Date(upToTime).getTime() >= new Date(fromTime).getTime(),
      {
        message: 'upToTime can not be less than fromTime',
      },
    )
    .parse(booking);

  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) {
    throw new Error('email not specified');
  }

  const accounts = await getAccounts();
  const emails = accounts.map(({ email }) => email);
  if (!emails.includes(email)) {
    throw new Error('forbidden');
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
    throw new Error('invalid washing machine id');
  }

  const ONE_HOUR = 60 * 60 * 1_000;
  const ONE_DAY = 24 * ONE_HOUR;
  const MAX_BOOK_IN_ADVANCE = ONE_DAY;
  const MAX_BOOK_DURATION = 5 * ONE_HOUR;
  const now = new Date();
  if (now.getTime() > new Date(fromTime).getTime()) {
    throw new Error('can not book for the past');
  }
  if (now.getTime() + MAX_BOOK_IN_ADVANCE < new Date(upToTime).getTime()) {
    throw new Error('can not book more than 24 hours in advance');
  }
  if (new Date(upToTime).getTime() - new Date(fromTime).getTime() > MAX_BOOK_DURATION) {
    throw new Error('can not book for more than 5 hours');
  }

  return await executeMongo(async (db) => {
    const collection = db.collection<Booking>('booking');
    const uuid = randomUUID({ disableEntropyCache: true });
    return await collection.insertOne({
      _id: uuid,
      washingMachineId,
      fromTime: new Date(fromTime),
      upToTime: new Date(upToTime),
      firstname: firstName,
      lastname: lastName,
      roomNumber,
      bookedUserEmail: email,
    });
  });
}
