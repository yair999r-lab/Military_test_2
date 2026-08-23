import { createMongoClient } from "./mongoDB/db.js";
import { lodeMapFromJSon } from "./file-heandler/read-file.js";
import { myRepo } from "./mongo-repo/repository.js";

const db = await createMongoClient()
const collection1 = db.collection("Risk_game")
const collection2 = db.collection("apm-game-start")

const mongoRepo = myRepo()

export async function gameStartup() {
    try {
        const existsMap = await mongoRepo.findData(collection2)
        if(!existsMap){
        const map = await lodeMapFromJSon()
        await mongoRepo.addNewMap(collection2 ,map)
        return;
        }
    } catch (error) {
        next(error)
    }

}
await gameStartup()




