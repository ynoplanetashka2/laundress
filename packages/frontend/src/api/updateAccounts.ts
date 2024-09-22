'use server';

import { AccountSchema, type Account } from '@/schemas/Account';
import { getAccounts } from './getAccounts';
import { getServerSession } from 'next-auth';
import { executeMongo } from './executeMongo';
import { AnyBulkWriteOperation } from 'mongodb';
import { differenceBy } from 'lodash';

export async function updateAccounts(newAccounts: Account[]): Promise<{ error?: string; }> {
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

  const parseResult = AccountSchema.array().safeParse(newAccounts);
  if (parseResult.error) {
    return { error: parseResult.error.toString() };
  }

  await executeMongo(async (db) => {
    const collection = db.collection<Account>('account');
    const newEmails = newAccounts.map(({ email }) => email);
    await collection.bulkWrite([
      { deleteMany: { filter: { email: { $not: { $in: newEmails } } } } },
      ...newAccounts.map<AnyBulkWriteOperation<Account>>(
        ({ email, priviledge }) => ({
          updateOne: {
            filter: { email: { $eq: email } },
            update: { $set: { priviledge } },
          },
        }),
      ),
      ...differenceBy(newAccounts, accounts, ({ email }) => email).map<
        AnyBulkWriteOperation<Account>
      >(({ email, priviledge }) => ({
        insertOne: {
          document: {
            email,
            priviledge,
          },
        },
      })),
    ]);
  });
  return {};
}
