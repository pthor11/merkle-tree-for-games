import { HmacSHA256, enc } from "crypto-js";
import Decimal from "decimal.js";
import { randomBytes } from "crypto";


// const seedGenerator = (address: string, buybox_blockHash: string, unbox_blockhash: string, tokenId: number, n: number = 0, index: number = 0): string => {
//     if (index < 0 || index > 2) throw new Error(`index must be 0|1|2`)
//     const hmac = HmacSHA256(`${address}:${buybox_blockHash}:${unbox_blockhash}:${tokenId}:${index.toString()}`, n.toString());
//     return hmac.toString(enc.Hex);
// }

// const getBoxResults = (address: string, buybox_blockHash: string, unbox_blockhash: string, tokenId: number, box_type: number): number[] => {
//     if (box_type < 0 || box_type > 2 || typeof box_type !== 'number' || !Number.isInteger(box_type)) throw new Error(`box_type must be 0|1|2`)

//     const results: number[] = []

//     let i = 0
//     let n = 0

//     const quantity_max = box_type === 0 ? 50 : (box_type === 1 ? 70 : 100)

//     while (i >= 0 && i <= 2) {
//         const seed = seedGenerator(address, buybox_blockHash, unbox_blockhash, tokenId, n, i)

//         const max_mod = quantity_max - (2 - i) - results.reduce((total, item) => total + item, 0)

//         n = new Decimal(`0x` + seed).mod(max_mod).toNumber()

//         n = n === 0 ? 1 : n

//         results.push(n)

//         i += 1
//     }

//     return results
// }


// const results = getBoxResults('0x4E96AcF083AEbfA32b49C1FE04B8Be70C98EA2C2', '0x94eb22f5266d9ae816ce4d64af5a0267a59bbf3ca80856b22199f82b032d6429', '0x9cc4edf72cbff7c1edab185bcdbb4957a7d3a1b9e48ef57c8385496763f462bb', 24, 2)

// console.log({ results });


console.log(`0x${randomBytes(32).toString('hex')}`)