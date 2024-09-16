import type { Account } from "@/schemas/account";
import { executeMongo } from "./executeMongo";

export async function getAccounts() {
  return executeMongo(async (db) => {
    const accountsCollection = db.collection('accounts');
    const accounts = await accountsCollection.find().toArray();
    return accounts as unknown as Account[];
  });
}