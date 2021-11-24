import { config } from "dotenv";

config()

export const BSC_TEST_RPC = process.env.BSC_TEST_RPC

export const PRIVATE_KEY = process.env.PRIVATE_KEY

export const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY

export const TIME_PERIOD_IN_SECONDS = process.env.TIME_PERIOD_IN_SECONDS

export const PANCAKE_ROUTER_ADDRESS = process.env.PANCAKE_ROUTER_ADDRESS

export const BUSD_TOKEN_ADDRESS = process.env.BUSD_TOKEN_ADDRESS

export const PRL_TOKEN_ADDRESS = process.env.PRL_TOKEN_ADDRESS

export const RUNE_PROXY_CONTRACT_ADDRESS = process.env.RUNE_PROXY_CONTRACT_ADDRESS

export const RUNE_PLASTIC_ADDRESS = process.env.RUNE_PLASTIC_ADDRESS

export const RUNES = [
    "PLASTIC",
    "PAPER",
    "FUR",
    "LEAF",
    "BRICK",
    "WOOD",
    "STONE",
    "IRON",
    "SILVER",
    "ICE",
    "GOLD",
    "DIAMOND"
]

export const PRA_NFT_ADDRESS = process.env.PRA_NFT_ADDRESS

export const TOKEN_REWARD = process.env.TOKEN_REWARD