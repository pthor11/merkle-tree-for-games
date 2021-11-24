import MerkleTree from "merkletreejs";
import { createHash } from "crypto";


function sha256(data) {
    // returns Buffer
    return createHash('sha256').update(data).digest()
}

const raw = ['a', 'b', 'c', 'd']

const leaves = raw.map(x => sha256(x))

const tree = new MerkleTree(leaves, sha256)

tree.print()

console.log(tree.getHexRoot())

tree.verify(raw, 'a', tree.getHexRoot())

// console.log('tree', tree);
// console.log('print', tree.print());
// console.log('toString', tree.toString());
