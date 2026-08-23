export function myService(){
    function addInitSoldiersToMap(map){
        const territories = []
        map.forEach((ter) => {
            ter.soldiers = 3
            ter.owner  = ter.startOwner
            territories.push(ter)
        })
        return territories
    }

        function createNewInitGsmeObj(player){
            const initGame = {
            playerName: player,
            round: 1,
            phase: "reinforce",
            status: "playing",
            winner: null }    
            return initGame
        }

        function checkIfGameExists(game){
            if(!game){
                const error = new Error("Not Found")
                error.status = 404
                throw error
            }
        }

        function checkAcativti(game){
            console.log(typeof game.phase, typeof game.status)
            if(game.status === "playing" && game.phase === "reinforce"){
                return;
            }
            else{
                const error = new Error("game must be active end in phase reinforce!!!")
                error.status = 404
                throw error
            }
        }

        function checkTerritory(game, territoryId){
            const selectdTerr = game.territories.find((ter) => Number(ter.id) === Number(territoryId))
            if(!selectdTerr || selectdTerr.owner === "computer"){
                const error = new Error("The territory must belong to the player!!!")
                error.status = 404
                throw error
            }
        }
    
    return {addInitSoldiersToMap, createNewInitGsmeObj, checkIfGameExists, checkAcativti, checkTerritory}
}

