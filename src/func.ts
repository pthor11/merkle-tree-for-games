declare var require: any
const fs = require("fs");
import { HmacSHA256, enc } from "crypto-js";
import Decimal from "decimal.js";
import { randomBytes } from "crypto";




const seedGenerator = (address: string, unbox_blockhash: string, tokenId: number, n: number = 0, index: number = 0): string => {
    if (index < 0 || index > 2) throw new Error(`index must be 0|1|2`)
    const hmac = HmacSHA256(`${address}:${unbox_blockhash}:${tokenId}:${index.toString()}`, n.toString());
    return hmac.toString(enc.Hex);
}

const getBoxResults = (address: string, unbox_blockhash: string, tokenId: number, box_type: number): number[] => {
    if (box_type < 0 || box_type > 2 || typeof box_type !== 'number' || !Number.isInteger(box_type)) throw new Error(`box_type must be 0|1|2`)

    const results: number[] = []

    let i = 0
    let n = 0

    const quantity_max = box_type === 0 ? 50 : (box_type === 1 ? 70 : 100)

    while (i >= 0 && i <= 2) {
        const seed = seedGenerator(address, unbox_blockhash, tokenId, n, i)

        const max_mod = quantity_max - (2 - i) - results.reduce((total, item) => total + item, 0);

        n = new Decimal(`0x` + seed).mod(max_mod).toNumber() + 1;

        n = n === 0 ? 1 : n


        results.push(n)

        i += 1
    }




    return results
}


const getBoxResults2 = (address: string, unbox_blockhash: string, tokenId: number, box_type: number): number[] => {
    if (box_type < 0 || box_type > 2 || typeof box_type !== 'number' || !Number.isInteger(box_type)) throw new Error(`box_type must be 0|1|2`)

    const results: number[] = []
    let max_mod_arr: number[] = [30];
    let i = 0
    let n = 0

    const quantity_max = box_type === 0 ? 50 : (box_type === 1 ? 70 : 100)


    while (i >= 0 && i <= 2) {
        const seed = seedGenerator(address, unbox_blockhash, tokenId, n, i)

        const max_mod = max_mod_arr[i];

        n = new Decimal(`0x` + seed).mod(max_mod).toNumber() + 1;

        n = n === 0 ? 1 : n
        if (i == 0) {
            max_mod_arr.push(40 - max_mod_arr[0])
        }
        if (i == 1) {
            max_mod_arr.push(50 - max_mod_arr[0] - max_mod_arr[1]);
        }
        results.push(n)

        i += 1
    }




    return results
}

const items: string[] = ['Paranium',
    'Pythium',
    'Crypton',
    'Onixius',
    'Gem',
    'Metal',
    'Crystal',
    'Plastic',
    'Rubber',
    'Wood',
    'Stone',
    'Soil'];



function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomIntFromInterval2(address: string, unbox_blockhash: string) {
    let rd_seed = seedGenerator(address, unbox_blockhash, 1, 0, 0);
    const rd_max = 100001;
    let rd_num = new Decimal(`0x` + rd_seed).mod(rd_max).toNumber();
    return rd_num;
}


function percentage_random2(items: string[], percentage: number[], address: string, unbox_blockhash: string): string {
    let rdNumber: number = randomIntFromInterval2(address, unbox_blockhash) / 100000;
    let w: number[] = percentage;
    for (let j = 1; j < 11; j++)
        w[j] = w[j - 1] + percentage[j];
    let i = 0;
    w[11] = 1;
    for (i; i < w.length; i++)
        if (w[i] >= rdNumber)
            break;

    return items[i];
}

// Generate dynamic probs 
function take_box(n: number, boxType: string, address: string, unbox_blockhash: string): string {
    let results: number[];
    let box_weight: number[];
    if (boxType == 'Golden') {
        results = [0.0001,
            0.00016,
            0.00018,
            0.0004,
            0.0008,
            0.002,
            0.03,
            0.07,
            0.105,
            0.2,
            0.24,
            0.35136];
        box_weight = [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5];

    }
    else if (boxType == 'Platinum') {
        results = [0.0005,
            0.00064,
            0.00072,
            0.0016,
            0.0024,
            0.0035,
            0.04,
            0.09,
            0.12,
            0.21,
            0.22,
            0.31];
        box_weight = [1, 2, 3, 4, 5, 5, 5, 5, 10, 10, 15, 5];
    } else {
        results = [0.001,
            0.0013,
            0.0015,
            0.0035,
            0.005,
            0.006,
            0.05,
            0.1,
            0.14,
            0.2,
            0.23,
            0.2617];
        box_weight = [1, 2, 3, 4, 5, 5, 10, 10, 15, 15, 25, 5];
    }

    if (n == 1) {


        return percentage_random2(items, results, address, unbox_blockhash);
    }
    else if (n > 1) {

        let cum_sum = 0;
        for (let i = 0; i < box_weight.length; i++) {
            cum_sum = cum_sum + box_weight[i];
            let cum_probs = 0;
            let multi_probs = 0;
            var remain_w = 0;
            if (cum_sum - box_weight[i] < n && n <= cum_sum) {
                if (i == box_weight.length - 1) remain_w == 0;
                else remain_w = cum_sum - n;
                for (let j = 0; j < box_weight.length; j++) {
                    if (j < i) {
                        cum_probs = cum_probs + results[j];
                        results[j] = 0;
                    } else if (j == i) {
                        if (remain_w == 0) {
                            multi_probs = cum_probs + results[j];
                            results[j] = 0;
                        } else {
                            multi_probs = cum_probs + (results[j] - cum_probs) * (box_weight[i] - remain_w) / box_weight[i];
                            results[j] = results[j] - multi_probs
                        }
                    } else if (i < j && j < 11) {
                        results[j] = results[j] - multi_probs;
                    } else {
                        results[j] = 1 - results.reduce((a, b) => a + b, 0) + results[11];
                    }
                }
            }
        }
    } else {
        console.log("Khong co n thoa man");

    }

    return percentage_random2(items, results, address, unbox_blockhash);
}



function openBox(address: string, unbox_blockhash: string, type: number) {

    let s1: string, s2: string, s3: string, n1: number, n2: number, n3: number, n: number, box: string, arr_n: number[];
    if (type == 0) {
        box = 'Golden'
        arr_n = getBoxResults2(address, unbox_blockhash, randomIntFromInterval2(address, unbox_blockhash), type)


        s1 = take_box(arr_n[0], box, address, unbox_blockhash);

        s2 = take_box(arr_n[1], box, address, unbox_blockhash);

        s3 = take_box(arr_n[2], box, address, unbox_blockhash);


    } else if (type == 1) {
        box = 'Platinum'
        arr_n = getBoxResults2(address, unbox_blockhash, randomIntFromInterval(1, 1000000), type)


        s1 = take_box(arr_n[0], box, address, unbox_blockhash);

        s2 = take_box(arr_n[1], box, address, unbox_blockhash);

        s3 = take_box(arr_n[2], box, address, unbox_blockhash);

    } else {
        box = 'Diamond'
        arr_n = getBoxResults2(address, unbox_blockhash, randomIntFromInterval(1, 1000000), type)


        s1 = take_box(arr_n[0], box, address, unbox_blockhash);

        s2 = take_box(arr_n[1], box, address, unbox_blockhash);

        s3 = take_box(arr_n[2], box, address, unbox_blockhash);

    }
    return { 'box_name': box, 'n1': arr_n[0], 'n1_result': s1, 'n2': arr_n[1], 'n2_result': s2, 'n3': arr_n[2], 'n3_result': s3 };
}




const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'G5kNew3.csv',
    header: [
        { id: 'box_name', title: 'box_name' },
        { id: 'n1', title: 'n1' },
        { id: 'n1_result', title: 'n1_result' },
        { id: 'n2', title: 'n2' },
        { id: 'n2_result', title: 'n2_result' },
        { id: 'n3', title: 'n3' },
        { id: 'n3_result', title: 'n3_result' }
    ]
});

var rs_array: any[] = [];

for (let i = 0; i < 15000; i++) {
    const address = `0x${randomBytes(20).toString('hex')}`
    const unbox_blockhash = `0x${randomBytes(32).toString('hex')}`
    rs_array.push(openBox(address, unbox_blockhash, 2));
}

csvWriter
    .writeRecords(rs_array)
    .then(() => console.log('The CSV file was written successfully'));



