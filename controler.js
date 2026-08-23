import { createMongoClient } from "./mongoDB/db.js";
import { lodeMapFromJSon } from "./file-heandler/read-file.js";
import { myRepo } from "./mongo-repo/repository.js";
import { myService } from "./service.js";

const db = await createMongoClient();
const collection1 = db.collection("Risk_game");
const collection2 = db.collection("map-game-start");

const mongoRepo = myRepo();

const service = myService()

export async function controler(collection1, collection2) {
  async function loadMapToDataBase() {
    try {
      const existsMap = await mongoRepo.findData(collection2);
      if (!existsMap) {
        const map = await lodeMapFromJSon();
        await mongoRepo.addNewMap(collection2, map);
      }
      return existsMap;
    } catch (error) {
      throw error;
    }
  }

  async function createNewGame(playerName) {
    const initGame = service.createNewInitGsmeObj(playerName)
    const initMap = await loadMapToDataBase()
    initGame.territories = service.addInitSoldiersToMap(initMap.map)

    const allExistsGames = await mongoRepo.findAllgames(collection1)
    initGame.id = allExistsGames.length + 1

    await mongoRepo.addData(collection1, initGame)
    return initGame
  }

  async function getSaveGame(gameId) {
    const exsistGame = await mongoRepo.findData(collection1, {id: Number(gameId)})
    service.checkIfGameExists(exsistGame)
    return exsistGame
  }
  return { loadMapToDataBase, createNewGame, getSaveGame };
}

export const myControler = await controler(collection1, collection2);
