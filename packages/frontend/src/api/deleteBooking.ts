'use server';

import { Booking } from "@/schemas/Booking";
import { executeMongo } from "./executeMongo";
import { getAccounts } from "./getAccounts";
import { getServerSession } from "next-auth";
import { getBookings } from "./getBookings";

export async function deleteBooking(bookingId: string) {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) {
    return { error: 'email not specified' };
  }

  const accounts = await getAccounts();
  const adminAccounts = accounts.filter(
    ({ priviledge }) => priviledge === 'admin',
  );
  const adminEmails = adminAccounts.map(({ email }) => email);
  const theBooking = (await getBookings({ _id: { $eq: bookingId }})).at(0);
  if (!theBooking) {
    return { error: 'no booking with such id' };
  }
  const isBookingAuthor = theBooking.bookedUserEmail === email;
  if (!isBookingAuthor && !adminEmails.includes(email)) {
    return { error: 'forbidden' };
  }
  executeMongo(async (db) => {
    const collection = db.collection<Booking>('booking');
    const deleteResult = await collection.deleteOne({ _id: bookingId });
    return deleteResult;
  })
}