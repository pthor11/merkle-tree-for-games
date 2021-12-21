import { HmacSHA256, enc } from "crypto-js";
import Decimal from "decimal.js";

const random = 'random'
const key = 'key'
const enc_parse = enc.Hex.parse(random).toString(enc.Hex)
const hmac_random = HmacSHA256(random, key).toString(enc.Hex)
const hmac_enc_parse = HmacSHA256(enc_parse, key).toString(enc.Hex)

// console.log({
//     random,
//     enc_parse,
//     hmac_random,
//     hmac_enc_parse
// })


const seedGenerator = (address: string, buybox_blockHash: string, unbox_blockhash: string, tokenId: number, n: number = 0, index: number = 0): string => {
    if (index < 0 || index > 2) throw new Error(`index must be 0|1|2`)
    const hmac = HmacSHA256(`${address}:${buybox_blockHash}:${unbox_blockhash}:${tokenId}:${index.toString()}`, n.toString());
    // const hmac = HmacSHA256(enc.Hex.parse(address), txid);
    return hmac.toString(enc.Hex);
}

function* randomNumberGenerator(hashed: string): Generator<number> {
    while (true) {
        const hash = Buffer.from(hashed, 'hex')
        let cursor = 0

        while (cursor < hash.byteLength / 3) {
            const hashing = hash
                .slice(cursor * 3, ++cursor * 3)
                .reduce(
                    (sum, byte, index) =>
                        sum.add(new Decimal(byte).dividedBy(256 ** (index + 1))),
                    new Decimal(0)
                ).toNumber();
            yield hashing
        }
        cursor = 0;
    }
}

const rollNumbers = (hashed: string, numbers: number, possible: number): number[] => {
    const generator = randomNumberGenerator(hashed)

    const results: number[] = []

    while (results.length < numbers) {
        const number = generator.next().value

        const result = new Decimal(number).times(possible).trunc().toNumber()

        if (!results.includes(result)) results.push(result)
    }

    return results.sort()
}

const getDiceResult = (direction: number, hashed: string): number => direction === 0 ? rollNumbers(hashed, 1, 100)[0] : 99 - rollNumbers(hashed, 1, 100)[0]

const getBoxResult = (seed: string): number => new Decimal(`0x` + seed).mod(100).toNumber()


export { seedGenerator, getDiceResult }

// const seed = seedGenerator('0x4E96AcF083AEbfA32b49C1FE04B8Be70C98EA2C2', '0x94eb22f5266d9ae816ce4d64af5a0267a59bbf3ca80856b22199f82b032d6429', '0x9cc4edf72cbff7c1edab185bcdbb4957a7d3a1b9e48ef57c8385496763f462bb', 100)

// console.log({ seed });

// const result = getDiceResult(0, seed)

// console.log({ result });

const getBoxResults = (address: string, buybox_blockHash: string, unbox_blockhash: string, tokenId: number, box_type: number): number[] => {
    if (box_type < 0 || box_type > 2 || typeof box_type !== 'number' || !Number.isInteger(box_type)) throw new Error(`box_type must be 0|1|2`)

    const results: number[] = []

    let i = 0
    let n = 0

    const quantity_min = 1
    const quantity_max = box_type === 0 ? 50 : (box_type === 1 ? 70 : 100)

    while (i >= 0 && i <= 2) {
        const seed = seedGenerator(address, buybox_blockHash, unbox_blockhash, tokenId, n, i)

        // let max: number

        // if (i === 0) {
        //     max = quantity_max - 2
        // } else if (i === 1) {
        //     max = quantity_max - 1 - results[0]
        // } else {
        //     max = quantity_max - results[0] - results[1]
        // }

        const max_mod = quantity_max - (2 - i) - results.reduce((total, item) => total + item, 0)

        n = new Decimal(`0x` + seed).mod(max_mod).toNumber()

        n = n === 0 ? 1 : n

        const rune_type = new Decimal(`0x` + seed).mod(1000000).toNumber()

        /* 
        1-1.000.000 
        1 thì sẽ ra Paranium
        từ 2 đến 11 sẽ ra Pythium
        12-18 sẽ ra Crypton
        19-40 sẽ ra Onixius 
        81-200 => Metal
        201-700 => Crystal
        701-2000 => Plastic
        2001-5500 => Rubber
        5501-100.000 => Wood
        100.001-200.000 => Stone 
        200.001-1.000.000 => Soi
        */

        let rune: number | undefined = undefined

        if (rune_type === 1) {
            rune = 11
        } else if (rune_type >= 2 && rune_type < 11) {
            rune = 10
        } else if (rune_type >= 12 && rune_type < 18) {
            rune = 9
        } else if (rune_type >= 19 && rune_type < 40) {
            rune = 8
        } else if (rune_type >= 41 && rune_type < 80) {
            rune = 7
        } else if (rune_type >= 81 && rune_type < 200) {
            rune = 6
        } else if (rune_type >= 201 && rune_type < 700) {
            rune = 5
        } else if (rune_type >= 701 && rune_type < 2000) {
            rune = 4
        } else if (rune_type >= 2001 && rune_type < 5500) {
            rune = 3
        } else if (rune_type >= 5501 && rune_type < 100000) {
            rune = 2
        } else if (rune_type >= 100001 && rune_type < 200000) {
            rune = 1
        } else {
            rune = 0
        }

        runes[rune] = runes[rune] !== undefined ? runes[rune] + 1 : 0

        // const rune_type = Math.floor(Math.log(11 - new Decimal(`0x` + seed).mod(11).toNumber()) * 10)
        // const rune_type = Math.log(11 - new Decimal(`0x` + seed).mod(11).toNumber())
        // const rune_type = new Decimal(`0x` + seed).mod(11).toNumber()

        // runes[rune_type] = runes[rune_type] !== undefined ? runes[rune_type] + 1 : 0

        console.log({ seed, max_mod, n, rune_type });

        results.push(n)

        i += 1
    }

    return results
}


// const results = getBoxResults('0x4E96AcF083AEbfA32b49C1FE04B8Be70C98EA2C2', '0x94eb22f5266d9ae816ce4d64af5a0267a59bbf3ca80856b22199f82b032d6429', '0x9cc4edf72cbff7c1edab185bcdbb4957a7d3a1b9e48ef57c8385496763f462bb', 24, 2)

// console.log({ results, total: results.reduce((total, item) => total + item, 0) });


const totals = {}
const runes = {}

for (let i = 0; i < 10000000; i++) {
    const results = getBoxResults('0x4E96AcF083AEbfA32b49C1FE04B8Be70C98EA2C2', '0x94eb22f5266d9ae816ce4d64af5a0267a59bbf3ca80856b22199f82b032d6429', '0x9cc4edf72cbff7c1edab185bcdbb4957a7d3a1b9e48ef57c8385496763f462bb', i, 0)

    const total = results.reduce((total, item) => total + item, 0)

    console.log(i, results, total);

    totals[total] = totals[total] !== undefined ? totals[total] + 1 : 0

}

console.log({ totals });
console.log({ runes });


