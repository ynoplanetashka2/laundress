'use server';

import type { Filter, WithId } from 'mongodb';
import { executeMongo } from './executeMongo';
import type { WashingMachine } from '@/schemas/WashingMachine';

export async function getWashingMachines(filter?: Filter<WithId<WashingMachine>>) {
  return await executeMongo(async (db) => {
    const collection = db.collection<WashingMachine>('washingMachine');
    const washingMachines = await (
      filter ? collection.find(filter) : collection.find()
    ).toArray();
    return washingMachines;
  });
}
