'use server';

import { Booking } from "@/schemas/Booking";
import { executeMongo } from "./executeMongo";

export async function deleteBooking(bookingId: string) {
  executeMongo(async (db) => {
    const collection = db.collection<Booking>('booking');
    const deleteResult = await collection.deleteOne({ _id: bookingId });
    return deleteResult;
  })
}