import { executeMongo } from "./executeMongo";

export async function getUsersEmails() {
  return executeMongo(async (db) => {
    const accountsCollection = db.collection('accounts');
    const accounts = await accountsCollection.find().toArray();
    return accounts;
  });
}