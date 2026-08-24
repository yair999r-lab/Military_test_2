import express from "express"

import { validPlayerName, validTerritory, validMove } from "../middleware.js"
import { myControler } from "../controler.js"

const router = express.Router()

router.post("/games", validPlayerName, async (req, res, next) => {
    try {
        const newPlayer = req.body.playerName
        const newGame = await myControler.createNewGame(newPlayer)
        res.status(201).json({...newGame})
    } catch (error) {
        next(error)
    }
})

router.get("/games/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const exsistsGame = await myControler.getSaveGame(id)
        res.status(200).json({...exsistsGame})
    } catch (error) {
        next(error)
    }
})

router.post("/games/:id/reinforce", validTerritory ,async (req, res, next) => {
    try {
        const gameId = req.params.id
        const territory = req.body.territoryId
        console.log("azazazazazazazazazazazaz")
        const updateGame = await myControler.reinforcePlayer(gameId ,territory)
        res.status(200).json({...updateGame})
    } catch (error) {
        next(error)
    }
})

router.post("/games/:id/attack", async (req, res, next) => {
    try {
        const gameId = req.params.id
        const fromId = req.body.fromId
        const toId = req.body.toId
        const soldiers = req.body.soldiers
        const skip = req.body.skip
         const nextMove = await myControler.attackStage(fromId, toId, soldiers, skip, gameId)
         console.log(nextMove)
         res.status(200).json({...nextMove})
    } catch (error) {
        next(error)
    }
})

router.post("/games/:id/move",validMove, async (req, res, next) =>{
    try {
    const gameId = req.params.id
    const { fromId, toId, soldiers } = req.body;
    const gameAfterMoveSoldiers = await myControler.moveSoldiers(gameId ,fromId, toId, soldiers)
    res.status(200).json({...gameAfterMoveSoldiers})
    } catch (error) {
        next(error)
    }
    
} )

router.post("/games/:id/end-turn", async (req, res, next) => {
    try {
    const gameId = req.params.id
    const gameAfterComuter = await myControler.endPlayerTurn(gameId)
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(gameAfterComuter)
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")
    res.status(200).json({...gameAfterComuter})
    } catch (error) {
        next(error)
    }
  
})


export default router