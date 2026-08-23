import express from "express"

import { validPlayerName } from "../middleware.js"
import { myControler } from "../controler.js"

const router = express.Router()

router.post("/game", validPlayerName, async (req, res, next) => {
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


export default router