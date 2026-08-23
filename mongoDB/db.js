import {MongoClient} from "mongodb"
import "dotenv/config"

const MONGOURI = process.env.MONGO_URI

export async function createMongoClient() {
    const client = await new MongoClient(MONGOURI)
    return client.db("Risk")
}


