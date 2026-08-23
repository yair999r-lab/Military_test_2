
export function validPlayerName(req, res, next){
    const player = req.body.playerName
    if(!player || !player.trim()){
        const error = new Error("Bad Request")
        error.status = 400
        next(error)
    }
    else{
        next()
    }
}

export function validTerritory(req, res, next){
    const terr = req.params.id
    if(!terr || !terr.trim()){
        const error = new Error("Bad Request")
        error.status = 400
        next(error)
    }
    else{
        next()
    }
}
