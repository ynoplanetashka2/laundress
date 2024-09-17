'use server';

import type { Filter, WithId } from 'mongodb';
import { executeMongo } from './executeMongo';
import type { Booking } from '@/schemas/Booking';
import { omit } from 'lodash';

export async function getBookings(filter?: Filter<WithId<Booking>>) {
  return await executeMongo(async (db) => {
    const collection = db.collection<Booking>('booking');
    const booked = await (
      filter ? collection.find(filter) : collection.find()
    ).toArray();
    return booked.map((booking) => omit(booking, '_id'));
  });
}
