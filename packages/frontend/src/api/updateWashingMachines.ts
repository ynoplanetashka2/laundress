'use server';

import { getAccounts } from './getAccounts';
import { getServerSession } from 'next-auth';
import { executeMongo } from './executeMongo';
import { AnyBulkWriteOperation } from 'mongodb';
import { differenceBy } from 'lodash';
import { WashingMachineSchema, type WashingMachine } from '@/schemas/WashingMachine';
import { getWashingMachines } from './getWashingMachines';

export async function updateWashingMachines(newWashingMachines: WashingMachine[]): Promise<{ error?: string; }> {
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
  if (!adminEmails.includes(email)) {
    return { error: 'forbidden' };
  }

  const parseResult = WashingMachineSchema.array().safeParse(newWashingMachines);
  if (parseResult.error) {
    return { error: parseResult.error.toString() };
  }

  const washingMachines = await getWashingMachines();

  await executeMongo(async (db) => {
    const collection = db.collection<WashingMachine>('washingMachine');
    await collection.bulkWrite([
      { deleteMany: { filter: { _id: { $not: { $in: newWashingMachines.map(({_id }) => _id) } } } } },
      ...newWashingMachines.map<AnyBulkWriteOperation<WashingMachine>>(
        ({ _id, label }) => ({
          updateOne: {
            filter: { _id: { $eq: _id } },
            update: { $set: { label } },
          },
        }),
      ),
      ...differenceBy(newWashingMachines, washingMachines, ({ _id }) => _id).map<
        AnyBulkWriteOperation<WashingMachine>
      >(({ _id, label }) => ({
        insertOne: {
          document: {
            _id,
            label,
          },
        },
      })),
    ]);
  });
  return {};
}

