import MerkleTree from "merkletreejs";
import BigNumber from "bignumber.js";
import { createHash, randomBytes } from "crypto";

function sha256(data) {
    return createHash('sha256').update(data).digest('hex').toString()
}

const randomTrees = (max_X: number, max_Y: number, quantity: number) => {
    let random_bytes = randomBytes(256).toString('hex')
    console.log('random_bytes', random_bytes);
    console.log('random_bytes', random_bytes.toString());

    const results: any[] = []

    while (results.length < quantity) {
        const x = new BigNumber('0x' + random_bytes.toString()).mod(max_X).toNumber()
        random_bytes = sha256(random_bytes)

        const y = new BigNumber('0x' + random_bytes.toString()).mod(max_Y).toNumber()
        random_bytes = sha256(random_bytes)

        console.log(x, y);

        if (results.find(item => item.x === x && item.y === y)) continue

        results.push({ x, y })
    }

    console.log('results', results);

    return results
}

const normalizeTrees = (trees: any[]) => {
    const arr = trees.map((tree, index) => {
        return {
            index,
            value: tree.x * 10000 + tree.y
        }
    })

    console.log('arr', arr);

    arr.sort((a, b) => a.value - b.value)

    console.log('arr', arr);

    return arr.map(item => trees[item.index])
}

const generateMarkleRoot = (trees: any[]) => {
    const merkle_tree = new MerkleTree(trees.map(tree => sha256(JSON.stringify(tree))))

    merkle_tree.print()

    return merkle_tree.getHexRoot()
}

const trees = normalizeTrees(randomTrees(256, 256, 100))
console.log(trees);
// const root = generateMarkleRoot(trees)
// console.log({ root });

