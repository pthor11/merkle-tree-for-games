import { HmacSHA256 } from "crypto-js";
import { createHmac } from "crypto";
import Web3 from "web3";

const web3 = new Web3()

// const key = Buffer.from('key').toString()
// const message = Buffer.from('message').toString()

// console.log({ key, message });

// const random = HmacSHA256('message', 'key')

// console.log(random.toString());

// const random_2 = createHmac('sha256', Buffer.from('key'))
// .update(Buffer.from('message'))
// .digest()
// .toString('hex');

// console.log(random_2)

/* 
 function combile(
        address boxOwner,
        bytes32 openHash,
        uint256 boxId,
        uint256 boxType
    ) public pure returns (bytes memory) {
        return abi.encodePacked(boxOwner, openHash, boxId, boxType);
    }
*/

const address = "0x4E96AcF083AEbfA32b49C1FE04B8Be70C98EA2C2"
const blockhash = "0x59081d0be3da9a33f00dbd1fad254c7b5e1fdee1d9a4c8029309c0786c92d868"
const boxId = "1000"
const n = "100"
const i = "1"

// const msg = web3.utils.soliditySha3(
//     { type: "address", value: address },
//     { type: "bytes32", value: blockhash },
//     { type: "uint256", value: boxId },
//     { type: "uint256", value: i }
// ) || ""

const msg = web3.eth.abi.encodeParameters(['address', 'bytes32', 'uint256', 'uint256'], [address, blockhash, boxId, i])

const key = web3.eth.abi.encodeParameters(['uint256'], [n])

console.log({ msg, key });

const random = HmacSHA256(Buffer.from(key,'hex').toString('utf-8'), Buffer.from(msg, 'hex').toString('utf-8'))

console.log(random.toString());
