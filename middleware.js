export function validPlayerName(req, res, next) {
  const player = req.body.playerName;
  if (!player || !player.trim()) {
    const error = new Error("Bad Request");
    error.status = 400;
    next(error);
  } else {
    next();
  }
}

export function validTerritory(req, res, next) {
  const terr = req.params.id;
  if (!terr || !terr.trim()) {
    const error = new Error("Bad Request");
    error.status = 400;
    next(error);
  } else {
    next();
  }
}

export function validAttackSkip(req, res, next) {
  const { fromId, toId, soldiers, skip } = req.body;
  if (!fromId || !toId || !soldiers) {
    if (!skip) {
      const error = new Error("Bad Request");
      error.status = 400;
      next(error);
    }
  } else {
    if (soldiers) {
      if (Number(soldiers) < 1) {
        const error = new Error("Bad Request");
        error.status = 400;
        next(error);
      }
    }
    next();
  }
}
