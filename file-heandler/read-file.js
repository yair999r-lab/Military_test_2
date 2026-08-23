import promises from "node:fs/promises"

const FILE = "map.json"

export async function lodeMapFromJSon() {
    try {
        const data = await promises.readFile(FILE)
    const map = JSON.parse(data)
    return map
    } catch (error) {
        console.error(error)
    }
    
}

