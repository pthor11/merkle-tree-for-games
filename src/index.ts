import MerkleTree from "merkletreejs";
import BigNumber from "bignumber.js";
import { createHash, randomBytes } from "crypto";

function sha256(data: string): string {
    return createHash('sha256').update(data).digest().toString('hex')
}

const randomTrees = (max_X: number, max_Y: number, quantity: number) => {
    const random_bytes = randomBytes(32)

    let random_bytes_hex = random_bytes.toString('hex')

    console.log('random_bytes_hex', random_bytes_hex);
    console.log('random_bytes_hex hashed', sha256(random_bytes_hex));
    

    const results: any[] = []

    while (results.length < quantity) {
        const x = new BigNumber('0x' + random_bytes_hex).mod(max_X).toNumber()
        random_bytes_hex = sha256(random_bytes_hex)

        const y = new BigNumber('0x' + random_bytes_hex).mod(max_Y).toNumber()
        random_bytes_hex = sha256(random_bytes_hex)

        if (results.find(item => item.x === x && item.y === y)) continue

        results.push({ x, y })
    }

    console.log('results', results);

    const arr = results.map((item, index) => {
        return {
            index,
            value: item.x * max_X + item.y
        }
    })

    arr.sort((a, b) => a.value - b.value)

    return arr.map(item => results[item.index])
}

const generateMarkleRoot = (trees: any[]) => {
    const merkle_tree = new MerkleTree(trees.map(tree => sha256(JSON.stringify(tree))))

    merkle_tree.print()

    return merkle_tree.getHexRoot()
}

const trees = randomTrees(256, 256, 100)
console.log(trees);
const root = generateMarkleRoot(trees)
console.log({ root });

