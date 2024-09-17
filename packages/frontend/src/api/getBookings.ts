'use server';

import type { Filter, WithId } from 'mongodb';
import { executeMongo } from './executeMongo';
import type { Booking } from '@/schemas/Booking';

export async function getBookings(filter?: Filter<WithId<Booking>>) {
  return await executeMongo(async (db) => {
    const collection = db.collection<Booking>('booking');
    const booked = await (
      filter ? collection.find<Booking>(filter) : collection.find()
    ).toArray();
    return booked;
  });
}
