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
    initGame.id = allExistsGames.length 

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
    service.checkAcativti(game, "attack")
    
      console.log("2434343434343434343434343434343434343")
    if(skip === true){
        game.phase = "move"
        const playerEvent = null
        const qgame = await computerTurn(game, playerEvent)

        const ce = qgame.computerEvents
        delete qgame.computerEvents

        const pe = qgame.computerEvents
        delete qgame.computerEvents
        await mongoRepo.updateGame(collection1 ,{id: Number(gameId)}, {...qgame})
         return {...qgame, playerEvent: pe, computerEvents: ce}
    }
    service.checkTerritory(game, fromId, "player")
    service.checkTerritory(game, toId, "computer")
    service.checkNeighoders(game ,fromId, toId)
    service.checkSendSoldiersAmount(game, fromId, soldiers)
    const battleResult = service.battle(game, fromId, toId ,soldiers)
    const winner = battleResult.winnerAttack
    delete battleResult.winnerAttack

    const ce = battleResult.computerEvents
    delete battleResult.computerEvents
    

    await mongoRepo.updateGame(collection1 ,{id: Number(gameId)}, {...battleResult})
    
    return {game: battleResult, playerEvent: {type: "attack", fromId, toId, soldiers, winner}, computerEvents: []}
  }

  async function moveSoldiers(gameId,fromId, toId, soldiers) {
    const game = await getSaveGame(gameId)
    console.log("movesoldiers")
    service.checkAcativti(game, "move")
    service.checkNeighoders(game, fromId, toId)
    service.checkSendSoldiersAmount(game, fromId, soldiers)
    service.checkTerritory(game, fromId, "player")
    service.checkTerritory(game, toId, "player")
    const gameMove = service.move(game, fromId, toId, soldiers)
    const playerEvent = {type: "move", fromId, toId, soldiers}
    const gameAfterComuter = await computerTurn(gameMove, playerEvent)

    await mongoRepo.updateGame(collection1 ,{id: Number(gameId)}, gameAfterComuter)
    
    return gameAfterComuter
  }

  async function computerTurn(game, playerEvent) {
    game.computerEvents = []
    const reinforceGame = service.checkStatus(game)
    const optinolAttack = service.computerOptiolAttack(reinforceGame)
    const battleResult = service.computerAttack(reinforceGame ,optinolAttack)
    const findMoveForComputer = service.computerMove(battleResult)
    const soldiersAmount = service.findMaxAmountSoldiers( battleResult, findMoveForComputer.from)
    const from  = findMoveForComputer.from
    const to = findMoveForComputer.to
    const gameMove = service.move(battleResult, from, to, soldiersAmount)
    gameMove.round += 1
    gameMove.phase = "reinforce"
    gameMove.computerEvents.push({type: "move",fromId: from , toId: to, soldiers: soldiersAmount})
    const computerTurn = gameMove.computerEvents
    delete gameMove.computerEvents
    console.log("goddddddddddddddddddddddddddd")
    const gamee = {game: gameMove, playerEvent, computerEvents: computerTurn}
    return gamee
  }
    

  async function endPlayerTurn(gameid) {
    const game = await getSaveGame(gameid)
    service.checkAcativti(game, "move")
    const playerEvent = null
    const gameAfterComuter = await computerTurn(game, playerEvent) 
    gameAfterComuter.phase = "reinforce"
    await mongoRepo.updateGame(collection1 ,{id: Number(gameid)}, gameAfterComuter)

    return gameAfterComuter
  }

  return { loadMapToDataBase, createNewGame, getSaveGame, reinforcePlayer, attackStage , moveSoldiers, computerTurn, endPlayerTurn};
}

export const myControler = await controler(collection1, collection2);
