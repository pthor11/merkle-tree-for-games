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

const seedGenerator = (address: string, buybox_blockHash: string, unbox_blockhash: string, tokenId: number, n: number = 0): string => {
    const hmac = HmacSHA256(`${address}:${buybox_blockHash}:${unbox_blockhash}:${tokenId}`, n.toString());
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

const results = {}

for (let i = 0; i < 1000000; i++) {
    const seed = seedGenerator('0x4E96AcF083AEbfA32b49C1FE04B8Be70C98EA2C2', '0x94eb22f5266d9ae816ce4d64af5a0267a59bbf3ca80856b22199f82b032d6429', '0x9cc4edf72cbff7c1edab185bcdbb4957a7d3a1b9e48ef57c8385496763f462bb', i)

    const result = getBoxResult(seed)

    console.log(i, seed, result);

    results[result] = results[result] !== undefined ? results[result] + 1 : 0
}

console.log({ results });


