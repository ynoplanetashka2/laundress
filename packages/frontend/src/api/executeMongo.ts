import { MongoClient, type Db } from "mongodb";

export async function executeMongo<Ret>(runner: (db: Db) => Promise<Ret>) {
  const CONNECTION_STRING = process.env.NEXT_MONGO_CONNECTION_STRING;
  if (CONNECTION_STRING === undefined) {
    throw new Error('invalid mongo connection string value');
  }
  const client = new MongoClient(CONNECTION_STRING);
  let error: unknown = null;
  try {
    const db = client.db('laundress');
    return await runner(db);
  } catch (err: unknown) {
    error = err;
  } finally {
    await client.close();
  }
  throw error;
}
