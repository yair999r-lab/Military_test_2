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

  async function reinforcePlayer( gameId ,territoryId) {
    const game = await getSaveGame(gameId)
    service.checkAcativti(game, "reinforce")
    service.checkTerritory(game, territoryId, "player")
    const selectdTerr = game.territories.find((ter) => Number(ter.id) === Number(territoryId))
    selectdTerr.soldiers += 3
    game.phase = "attack"
    await mongoRepo.updateGame(collection1 ,{id: Number(gameId)}, game)
    const playerEvent = {type: "reinforce", territoryId : territoryId, soldiersAdded: 3}
    return {game: game, playerEvent, computerEvents : [] }
  }

  async function attackStage(fromId, toId, soldiers, skip, gameId) {
    const game = await getSaveGame(gameId)
    console.log(game)
    service.checkAcativti(game, "attack")
    if(skip){
        game.phase = "move"
        await mongoRepo.updateGame(collection1 ,{id: Number(gameId)}, game)
        return {game: game, playerEvent: null, computerEvents: []}
    }
    service.checkTerritory(game, fromId, "player")
    service.checkTerritory(game, toId, "computer")
    service.checkNeighoders(game ,fromId, toId)
    service.checkSendSoldiersAmount(game, fromId, soldiers)
    const battleResult = service.battle(game, fromId, toId ,soldiers)
    const winner = battleResult.winnerAttack
    delete battleResult.winnerAttack

    await mongoRepo.updateGame(collection1 ,{id: Number(gameId)}, battleResult)
    
    return {game: battleResult, playerEvent: {type: "attack", fromId, toId, soldiers, winner}, computerEvents: []}
  }
  return { loadMapToDataBase, createNewGame, getSaveGame, reinforcePlayer, attackStage };
}

export const myControler = await controler(collection1, collection2);
