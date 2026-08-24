export function myService() {
  function addInitSoldiersToMap(map) {
    const territories = [];
    map.forEach((ter) => {
      ter.soldiers = 4;
      ter.owner = ter.startOwner;
      if(ter.headquarters === true){ter.soldiers += 4}
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

      const error = new Error("Not Found 1111111111111111111111111111");
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
    const tergat = game.territories.find(
      (ter) => Number(ter.id) === Number(toId),
    );

    if (!tergat.neighbors.includes(Number(fromId))) {
      const error = new Error(
        `The attack territory and the target territory do not border each other.!!!`,
      );
      error.status = 404;
      throw error;
    }
  }

  function checkSendSoldiersAmount(game, fromId, soldiersAmount) {
    const fromTerr = game.territories.find(
      (terr) => Number(terr.id) === Number(fromId),
    );
    if (soldiersAmount >= fromTerr.soldiers) {
      const error = new Error(
        `Too many soldiers have been sent. At least one soldier must remain!!!`,
      );
      error.status = 404;
      throw error;
    }
  }

  function battle(game, fromId, toId, sentSoldiers) {
    const fromTerr = game.territories.find(
      (terr) => Number(terr.id) === Number(fromId),
    );
    fromTerr.soldiers -= sentSoldiers;

    const defense = game.territories.find(
      (ter) => Number(ter.id) === Number(toId),
    );
    const defendingSoldiers = defense.soldiers;

    const attackLuck = 0.6 + Math.random() * 0.4;
    const defenseLuck = 0.6 + Math.random() * 0.4;

    const attackPower = sentSoldiers * attackLuck;
    const defensePower = defendingSoldiers * defenseLuck;
    game.phase = "move";
    if (attackPower > defensePower) {
      game.winnerAttack = fromTerr.owner;
      const survivors = Math.max(
        1,
        Math.ceil((sentSoldiers * (attackPower - defensePower)) / attackPower),
      );

      defense.owner = fromTerr.owner;
      defense.soldiers = survivors;

      if (defense.headquarters === true) {
        game.winner = fromTerr.owner;
        game.status = "finished";
      }
    } else {
      game.winnerAttack = defense.owner;
      const survivors = Math.max(
        1,
        Math.ceil(
          (defendingSoldiers * (defensePower - attackPower)) / defensePower,
        ),
      );
      defense.soldiers = survivors;
    }
    return game;
  }

  function move(game, fromId, toId, soldiers) {
    const fromTerr = game.territories.find(
      (terr) => Number(terr.id) === Number(fromId),
    );
    const toTerr = game.territories.find(
      (ter) => Number(ter.id) === Number(toId),
    );
    fromTerr.soldiers -= Number(soldiers);
    toTerr.soldiers += Number(soldiers);
    return game;
  }

  function checkStatus(game) {
    const closestToHeadquarters = game.territories.find(
      (terr) => terr.owner === "player" && terr.distanceFromComputerHQ <= 2,
    );

    let reinforceGame;
    if (closestToHeadquarters) {
      reinforceGame = computerReinforce(game, "distanceFromComputerHQ", "d");
      reinforceGame.computerStatus = "d";
    } else {
      reinforceGame = computerReinforce(game, "distanceFromPlayerHQ", "a");
      reinforceGame.computerStatus = "a";
    }

    return reinforceGame;
  }

  function findNe(game, select) {
    const computerTerr = game.territories.filter(
      (terr) => terr.owner !== "computer",
    );
    const playerTerr = game.territories.filter(
      (terr) => terr.owner !== "player",
    );
    const borderTerr = [];

    let selectdBord = computerTerr;
    let selectdTerrIds = playerTerr;
    if (select) {
      ((selectdBord = playerTerr), (selectdTerrIds = computerTerr));
    }

    const borderIds = [];
    selectdTerrIds.forEach((terr) => borderIds.push(terr.id));

    selectdBord.forEach((terr) => {
      let flag = false;

      const neighbors = terr.neighbors;
      neighbors.forEach((n) => {
        if (borderIds.includes(n)) {
          flag = true;
        }
      });
      borderTerr.push(terr);
    });
    console.log("end find me");
    return borderTerr;
  }

  function findCom(game) {
    const computerTerr = game.territories.filter(
      (terr) => terr.owner !== "computer",
    );
    const playerTerr = game.territories.filter(
      (terr) => terr.owner !== "player",
    );
    const borderTerr = [];

    const borderIds = [];
    computerTerr.forEach((terr) => borderIds.push(terr.id));

    playerTerr.forEach((terr) => {
      let flag = false;
      const neighbors = terr.neighbors;
      neighbors.forEach((n) => {
        if (borderIds.includes(n)) {
          flag = true;
        }
      });
      borderTerr.push(terr);
    });
    return borderTerr;
  }

  function computerReinforce(game, hq, status) {
    const borderTerr = findCom(game);
    borderTerr.sort((a, b) => a.hq - b.hq);

    const theClosest = [];
    let theWeeker = [];
    let wekerTerr;

    borderTerr.forEach((terr) => {
      if (terr.hq === borderTerr[0].hq) {
        theClosest.push(terr);
      }
    });

    wekerTerr = theClosest[0];
    if (theClosest.length > 1) {
      theClosest.forEach((terr) => {
        theWeeker.push(theClosest[0]);
        if (status === "a") {
          if (terr.soldiers > theWeeker[0].soldiers) {
            theWeeker = [];
            theWeeker.push(terr);
          }
        } else if (status === "d") {
          if (terr.soldiers < theWeeker[0].soldiers) {
            theWeeker = [];
            theWeeker.push(terr);
          }
        } else if (terr.soldiers === theWeeker[0].soldiers) {
          theWeeker.push(terr);
        }
      });
      wekerTerr = theWeeker[0];
    }

    if (theWeeker.length > 1) {
      theWeeker.sort((a, b) => a.id - b.id);
      wekerTerr = theWeeker[0];
    }

    wekerTerr.soldiers += 3;
    game.computerEvents.push({
      type: "reinforce",
      territoryId: wekerTerr.id,
      soldiersAdded: 3,
    });

    return game;
  }

  function getScore(sentSoldiers, from, to) {
    const progress = from.distanceFromPlayerHQ - to.distanceFromPlayerHQ;
    const soldierAdvantage = sentSoldiers - to.soldiers;
    const protectsHeadquarters =
      Math.max(0, 3 - to.distanceFromComputerHQ) * 25;
    const progressScore = progress * 10;
    const headquartersScore = to.headquarters ? 1000 : 0;
    const score =
      progressScore +
      soldierAdvantage +
      protectsHeadquarters +
      headquartersScore;

    return score;
  }

  function computerOptiolAttack(game) {
    const computerBorderTerr = findNe(game);
    const playerBordoerTerr = findNe(game, true);

    let topScore = 0;
    let battle;

    computerBorderTerr.forEach((from) => {
      from.neighbors.forEach((n) => {
        const to = playerBordoerTerr.find((t) => t.id === n);
        if (to) {
          const sentSoldiers = from.soldiers - 1;
          const advantageRatio = sentSoldiers / to.soldiers;

          let score = 0;

          if (to.headquarters === true) {
            if (sentSoldiers > to.soldiers) {
              score = getScore(sentSoldiers, from, to);
            }
          } else {
            if (advantageRatio >= 1.35) {
              score = getScore(sentSoldiers, from, to);
            }
          }
          if (score > topScore) {
            topScore = score;
            battle = { from, to, sentSoldiers };
          }
        }
      });
    });

    return battle;
  }

  function computerAttack(game, optinolAttack) {
    if (!optinolAttack) {
      return game;
    } else {
      const fromId = optinolAttack.from.id;
      const toId = optinolAttack.to.id;
      const sentSoldiers = optinolAttack.sentSoldiers;
      const battleResult = battle(game, fromId, toId, sentSoldiers);
      const winner = battleResult.winnerAttack;
      delete battleResult.winnerAttack;

      battleResult.computerEvents.push({
        type: "attack",
        fromId,
        toId,
        soldiers: sentSoldiers,
        winner,
      });
      return battleResult;
    }
  }

  function computerMove(game) {
    const computerTerr = game.territories.filter(
      (terr) => terr.owner === "computer",
    );

    const computerTerrIds = [];
    computerTerr.forEach((terr) => computerTerrIds.push(terr.id));

    const optionelMoveTerr = [];
    computerTerr.forEach((terr) => {
      terr.neighbors.forEach((n) => {
        if (computerTerrIds.includes(n)) {
            if(n === terr.id){}
            else{const to = computerTerr.find((t) => t.id === n);
            if (game.computerStatus === "d") {
              if (to.distanceFromComputerHQ < terr.distanceFromComputerHQ) {
                optionelMoveTerr.push({ from: terr, to: to });
              }
            } else {
              if (to.distanceFromPlayerHQ < terr.distanceFromPlayerHQ) {
                optionelMoveTerr.push({ from: terr, to: to });
              }
            }}
          
          
        }
      });
    });

    let topSoldiers = [];
    let topSoldier = 0;
    let fromId;
    let toId;

    let smallTo = [];

    optionelMoveTerr.forEach((terr) => {
      if (terr.from.soldiers > topSoldier) {
        topSoldiers = [];
        topSoldiers.push(terr);
        fromId = terr.from.id;
        toId = terr.to.id;
      } else if (terr.from.soldiers === topSoldier) {
        topSoldiers.push(terr);
      }
    });

    if (topSoldier.length > 1) {
      smallTo.push(topSoldiers[0]);
      topSoldiers.forEach((terr) => {
        if (terr.to.id < topSoldier[0].to.id) {
          smallTo = [];
          smallTo.push(terr);
          fromId = terr.from.id;
          toId = terr.to.id;
        } else if (terr.to.id === topSoldier[0].to.id) {
          smallTo.push(terr);
        }
      });
    }

    if (smallTo.length > 1) {
      fromId = smallFromId[0].from.id;
      toId = smallFromId[0].from.id;
      smallTo.forEach((terr) => {
        if (terr.from.id < smallFromId[0]) {
          fromId = terr.from.id;
          toId = terr.to.id;
        }
      });
    }
    return { from: fromId, to: toId };
  }

  function findMaxAmountSoldiers(game, fromTerr) {
    const from = game.territories.find((terr) => terr.id === fromTerr);
    if (from.headquarters === true) {
      return from.soldiers - 4;
    } else {
      return from.soldiers - 1;
    }
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
    move,
    checkStatus,
    computerOptiolAttack,
    computerAttack,
    computerMove,
    findMaxAmountSoldiers,
  };
}
