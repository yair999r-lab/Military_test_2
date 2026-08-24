export function myService() {
  function addInitSoldiersToMap(map) {
    const territories = [];
    map.forEach((ter) => {
      ter.soldiers = 3;
      ter.owner = ter.startOwner;
      territories.push(ter);
    });
    return territories;
  }

  function createNewInitGsmeObj(player) {
    const initGame = {
      playerName: player,
      round: 1,
      phase: "reinforce",
      status: "playing",
      winner: null,
    };
    return initGame;
  }

  function checkIfGameExists(game) {
    if (!game) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
  }

  function checkAcativti(game, phase) {
    if (game.status === "playing" && game.phase === phase) {
      return;
    } else {
      const error = new Error(`game must be active end in phase ${phase}!!!`);
      error.status = 404;
      throw error;
    }
  }

  function checkTerritory(game, territoryId, owner) {
    const selectdTerr = game.territories.find(
      (ter) => Number(ter.id) === Number(territoryId),
    );
    if (!selectdTerr || !selectdTerr.owner === owner) {
      const error = new Error(`The territory must belong to the ${owner}!!!`);
      error.status = 404;
      throw error;
    }
  }

  function checkNeighoders(game, fromId, toId) {
    const tergat = game.territories.find((ter) => Number(ter.id) === Number(toId));

    if (!tergat.neighbors.includes(Number(fromId))) {
      const error = new Error(
        `The attack territory and the target territory do not border each other.!!!`,
      );
      error.status = 404;
      throw error;
    }
  }

  function checkSendSoldiersAmount(game, fromId, soldiersAmount) {
    const fromTerr = game.territories.find((terr) => Number(terr.id) === Number(fromId));
    if (soldiersAmount >= fromTerr.soldiers) {
      const error = new Error(
        `Too many soldiers have been sent. At least one soldier must remain!!!`,
      );
      error.status = 404;
      throw error;
    }
  }

  function battle(game, fromId, toId, sentSoldiers) {
    const fromTerr = game.territories.find((terr) => Number(terr.id) === Number(fromId));
    fromTerr.soldiers -= sentSoldiers;

    const defense = game.territories.find((ter) => Number(ter.id) === Number(toId));
    const defendingSoldiers = defense.soldiers;

    const attackLuck = 0.6 + Math.random() * 0.4;
    const defenseLuck = 0.6 + Math.random() * 0.4;

    const attackPower = sentSoldiers * attackLuck;
    const defensePower = defendingSoldiers * defenseLuck;

    if (attackPower > defensePower) {
        game.phase = "move"
        game.winnerAttack = fromTerr.owner
      const survivors = Math.max(
        1,
        Math.ceil((sentSoldiers * (attackPower - defensePower)) / attackPower),
      );

      defense.owner = fromTerr.owner;
      defense.soldiers = survivors;

      if(defense.headquarters === true){
        game.winner = fromTerr.owner
        game.status = "finished"
      }

    } else {
        game.phase = "move"
        game.winnerAttack = defense.owner
      const survivors = Math.max(
        1,
        Math.ceil(
          (defendingSoldiers * (defensePower - attackPower)) / defensePower,
        ),
      );
      defense.soldiers = survivors
    }
    return game
  }

  return {
    addInitSoldiersToMap,
    createNewInitGsmeObj,
    checkIfGameExists,
    checkAcativti,
    checkTerritory,
    checkNeighoders,
    checkSendSoldiersAmount,
    battle,
  };
}
