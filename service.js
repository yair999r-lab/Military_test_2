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
    
    return {addInitSoldiersToMap, createNewInitGsmeObj, checkIfGameExists}
}

