import express from "express"

import { validPlayerName } from "../middleware.js"
import { myControler } from "../controler.js"

const router = express.Router()

router.post("/game", validPlayerName, async (req, res, next) => {
    try {
        const newPlayer = req.body.playerName
        const newGame = await myControler.createNewGame(newPlayer)
        console.log(newGame)
        res.status(201).json({newGame})
    } catch (error) {
        next(error)
    }
})

export default router