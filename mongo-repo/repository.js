export function myRepo() {
  async function addNewMap(collection, mapData) {
    await collection.insertOne({ id: 1, map: mapData });
  }

  async function findData(collection, filter = {}) {
    const data = await collection.findOne(filter);
    return data;
  }
  async function findAllgames(collection) {
    const data = await collection.find().toArray();
    return data;
  }

  async function addData(collection, data) {
    const result = await collection.insertOne(data)
    return result.insertId
  }

  async function updateGame(collection, filter, data) {
    console.log(filter)
    const result = await collection.replaceOne(filter, data)
    console.log(result)
    return result
  }

  return { addNewMap, findData, findAllgames, addData, updateGame };
}
