import { randomBytes } from "crypto";
import { SHA256 } from "crypto-js"
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs"
import { data } from "./sample.airdrop"
import { getTime } from "./util"

console.log(getTime, `INIT`)

const normalize_airdrop_data = (address: string, amount: string) => `${address},${amount}`

const start = async () => {
    try {
        console.log(getTime, `START`)

        // for (let index = 0; index < data.length; index++) {
        //     const airdrop = data[index]
        //     const airdrop_data = normalize_airdrop_data(airdrop.address, airdrop.amount)

        //     console.log(airdrop_data);
        // }

        // const airdrops = data.map(airdrop => normalize_airdrop_data(airdrop.address, airdrop.amount))

        const addresses: string[] = []

        for (let i = 0; i < 1000; i++) {
            const address = '0x' + randomBytes(20).toString('hex')
            addresses.push(address)
        }

        const leaves = addresses.map(address => keccak256(address).toString('hex'))

        const merkle_tree = new MerkleTree(leaves, keccak256, { sort: true })

        merkle_tree.print()

        const root = merkle_tree.getHexRoot()

        console.log({ root });

        const address = addresses[500]

        const leaf = keccak256(address).toString('hex')

        console.log({ leaf });

        const proof = merkle_tree.getProof(leaf)
        // const proof = merkle_tree.getHexProof(leaf)

        console.log({ proof: merkle_tree.getHexProof(leaf) });

        const verify = merkle_tree.verify(proof, leaf, root)

        console.log({ verify });

    } catch (e) {
        console.error(getTime, `ERROR`)
        throw e
    } finally {
        console.log(getTime, `DONE`)
    }
}

start() 