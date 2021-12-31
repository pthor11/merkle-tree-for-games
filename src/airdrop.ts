import MerkleTree from "merkletreejs"
import { data } from "./sample.airdrop"
import { getTime } from "./util"

console.log(getTime, `INIT`)

const normalize_airdrop_data = (address: string, amount: string) => `${address},${amount}`

const start = async () => {
    try {
        console.log(getTime, `START`)

        for (let index = 0; index < data.length; index++) {
            const airdrop = data[index]
            const airdrop_data = normalize_airdrop_data(airdrop.address, airdrop.amount)
            
            console.log(airdrop_data);
        }

        const airdrops = data.map(airdrop => normalize_airdrop_data(airdrop.address, airdrop.amount))

        const merkle_tree = new MerkleTree(airdrops)

        merkle_tree.print()

        // console.log(merkle_tree.getHexProof)
        console.log(merkle_tree.getHexRoot())
        
    } catch (e) {
        console.error(getTime, `ERROR`)
        throw e
    } finally {
        console.log(getTime, `DONE`)
    }
}

start() 