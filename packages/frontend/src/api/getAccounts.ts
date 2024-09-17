import { Account, AccountSchema } from "@/schemas/account";
import { executeMongo } from "./executeMongo";
import { z } from "zod";

export async function getAccounts() {
  return executeMongo(async (db) => {
    const accountsCollection = db.collection<Account>('accounts');
    const accounts = await accountsCollection.find().toArray();
    return z.array(AccountSchema).parse(accounts);
  });
}