import { z } from "zod";

export const BookingSchema = z.object({
  _id: z.string().min(1),
  fromTime: z.date(),
  upToTime: z.date(),
  firstname: z.string().max(30).min(2),
  lastname: z.string().max(30).min(2),
  roomNumber: z.string().length(3, 'room number should contain exactly 3 digits'),
  washingMachineId: z.string().min(1),
  bookedUserEmail: z.string().email().min(4),
});

export type Booking = z.infer<typeof BookingSchema>;

export const BookingSerializableSchema =  z.object({
  _id: z.string().min(1),
  fromTime: z.string().datetime(),
  upToTime: z.string().datetime(),
  firstname: z.string().max(30).min(2),
  lastname: z.string().max(30).min(2),
  roomNumber: z.string().length(3, 'room number should contain exactly 3 digits'),
  washingMachineId: z.string().min(1),
  bookedUserEmail: z.string().email().min(4),
});

export type BookingSerializable = z.infer<typeof BookingSerializableSchema>;
