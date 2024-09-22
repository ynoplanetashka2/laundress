import { AccountSchema, type Account } from "@/schemas/Account";
import { executeMongo } from "./executeMongo";
import { z } from "zod";

export async function getAccounts() {
  return executeMongo(async (db) => {
    const accountsCollection = db.collection<Account>('account');
    const accounts = await accountsCollection.find().toArray();
    return z.array(AccountSchema).parse(accounts);
  });
}