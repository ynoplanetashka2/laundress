import { type Document, type WithId } from "mongodb";
import { executeMongo } from "./executeMongo";

export async function getUsersEmails() {
  return executeMongo(async (db) => {
    const usersColllection = db.collection('accounts');
    const usersCursor = usersColllection.find();
    const result: Array<WithId<Document>> = [];
    for await (const user of usersCursor) {
      result.push(user);
    }
    return result;
  });
}