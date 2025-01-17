export const MAINNET = 'mainnet';
export const TESTNET = 'testnet';
export const NETWORK = process.env.APP_ENV === MAINNET ? MAINNET : TESTNET;
export const BASE_TITLE = 'Honee';
export const BASE_DESCRIPTION = '';
export const BASE_URL_PREFIX = '';
export const ACCOUNTS_API_URL = process.env.APP_ACCOUNTS_API_URL;
export const GATE_API_URL = process.env.APP_GATE_API_URL;
export const EXPLORER_API_URL = process.env.APP_EXPLORER_API_URL;
export const EXPLORER_RTM_URL = process.env.APP_EXPLORER_RTM_URL;
export const EXPLORER_HOST = process.env.APP_EXPLORER_HOST;
export const EXPLORER_STATIC_HOST = process.env.APP_EXPLORER_STATIC_HOST;
export const CHAINIK_API_URL = 'https://chainik.io/json/';
export const FARM_API_URL = 'https://yf.chainik.io/api/v1/';
export const CARD_TO_MINTER_HOST = process.env.APP_CARD_TO_MINTER_HOST;
export const CARD_TO_MINTER_API_URL = 'https://card-api.minter.trade/v1/';
export const TELEGRAM_LEGACY_AUTH_API_URL = 'https://telegram-auth.honee.app/api/v1/';
export const TELEGRAM_AUTH_API_URL = 'https://premium-bot.honee.app/api/v1/';
export const STAKING_API_URL = process.env.APP_STAKING_API_URL;
export const REFERRAL_API_URL = process.env.APP_REFERRAL_API_URL;
export const PORTFOLIO_API_URL = process.env.APP_PORTFOLIO_API_URL;
export const HUB_ETHEREUM_CONTRACT_ADDRESS = process.env.APP_HUB_ETHEREUM_CONTRACT_ADDRESS;
export const HUB_BSC_CONTRACT_ADDRESS = process.env.APP_HUB_BSC_CONTRACT_ADDRESS;
export const HUB_MINTER_MULTISIG_ADDRESS = process.env.APP_HUB_MINTER_MULTISIG_ADDRESS;
export const HUB_API_URL = process.env.APP_HUB_API_URL;
export const HUB_DEPOSIT_PROXY_API_URL = process.env.APP_HUB_API_URL + 'deposit-proxy/';
export const SMART_WALLET_RELAY_API_URL = process.env.APP_HUB_API_URL + 'smart-wallet-relay/';
export const ETHEREUM_API_URL = process.env.APP_ETHEREUM_API_URL;
export const BSC_API_URL = process.env.APP_BSC_API_URL;
export const ETHEREUM_CHAIN_ID = NETWORK === MAINNET ? 1 : 3;
export const BSC_CHAIN_ID = NETWORK === MAINNET ? 56 : 97;
export const ETHERSCAN_API_URL = NETWORK === MAINNET ? 'https://api.etherscan.io/api/' : 'https://api-ropsten.etherscan.io/api/';
export const ETHERSCAN_API_KEY = 'I3VTWM2AX8BXS2ZX1FYRXINCWHQVVGEBJM';
export const ETHERSCAN_HOST = NETWORK === MAINNET ? 'https://etherscan.io' : 'https://ropsten.etherscan.io';
export const BSCSCAN_HOST = NETWORK === MAINNET ? 'https://bscscan.com' : 'https://testnet.bscscan.com';
export const ONE_INCH_API_URL = 'https://api.1inch.io/v5.0/';
export const PARASWAP_API_URL = 'https://apiv5.paraswap.io/';
export const ZERO_X_API_URL = 'https://bsc.api.0x.org/';
export const WETH_CONTRACT_ADDRESS = NETWORK === MAINNET ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' : '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5';// '0xc778417e063141139fce010982780140aa0cd5ab';
export const WBNB_CONTRACT_ADDRESS = NETWORK === MAINNET ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' : '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
// recognized by 1inch/paraswap/0x and other third parties as native coin
export const NATIVE_COIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const HUB_DEPOSIT_PROXY_CONTRACT_ADDRESS = '0x0C9B820C0877340333E874AE70395Da7353E7cA3';
export const SMART_WALLET_FACTORY_CONTRACT_ADDRESS = "0x7F3C8d5363B44875001Fa2A63A7dB6FCb8BEE989";
export const SMART_WALLET_RELAY_BROADCASTER_ADDRESS = '0x64e51D5930CDBbf99f3cB27654A03b18f7060C5E';
export const SMART_WALLET_RELAY_MINTER_ADDRESS = "Mxc9b1b39f4c94b1bcbf68c1beba97ab84f7763cf0";
export const GOATCOUNTER_HOST = 'https://counter-api.minter.network';
export const GOATCOUNTER_SCRIPT_HASH = 'sha384-Y8F5Ua/zQ+NPBrMSdg9H3WezYaB49Qf3WJsv3LLUntxBwBV2r8pOWJWJ7X7l8DXX';
export const BASE_COIN = NETWORK === MAINNET ? 'BIP' : 'MNT';
export const COIN_NAME = BASE_COIN;
export const CHAIN_ID = NETWORK === MAINNET ? 1 : 2;

export const LANGUAGE_COOKIE_KEY = 'minter-language';
export const I18N_ROUTE_NAME_SEPARATOR = '___';

export const PREMIUM_STAKE_PROGRAM_ID = 23;
export const PREMIUM_STAKE_LOCK_DURATION = 31536000; // 5 years
export const SUCCESS_FEE_TEAM_ADDRESS = 'Mx5a67a1f59138609f502a0e16e210d70bad03a745';
export const SUCCESS_FEE_FUND_ADDRESS = 'Mx2d347ede679b8c6b91d272c9aade5a716bda4b2f';
export const STAKE_RECALCULATE_BLOCK_COUNT = 720;
export const DASHBOARD_URL = '/';

export const REF_ID_QUERY = 'r';

export const SWAP_TYPE = {
    BANCOR: 'bancor',
    POOL: 'pool',
    POOL_DIRECT: 'pool_direct',
    OPTIMAL: 'optimal',
};

export const COIN_TYPE = {
    ANY: 'any',
    COIN: 'coin',
    ANY_TOKEN: 'any_token',
    TOKEN: 'token',
    POOL_TOKEN: 'pool_token',
};

/**
 * @readonly
 * @enum {string}
 */
export const HUB_NETWORK = {
    ETHEREUM: 'ethereum',
    BSC: 'bsc',
    MINTER: 'minter',
};

/**
 * @deprecated
 * @type {HUB_NETWORK}
 */
export const HUB_CHAIN_ID = HUB_NETWORK;

/**
 * @typedef {{coinSymbol: string, name: string, shortName: string, chainId: number, hubChainId: HUB_CHAIN_ID, hubNetworkSlug: HUB_CHAIN_ID, apiUrl: string, explorerHost: string, hubContractAddress: string, wrappedNativeContractAddress: string}} HubChainDataItem
 */

/**
 * @readonly
 * @type {Object.<string, HubChainDataItem>}
 */
export const HUB_CHAIN_DATA = {
    [HUB_NETWORK.ETHEREUM]: {
        name: 'Ethereum',
        shortName: 'Ethereum',
        coinSymbol: 'ETH',
        chainId: ETHEREUM_CHAIN_ID,
        hubChainId: HUB_NETWORK.ETHEREUM,
        hubNetworkSlug: HUB_NETWORK.ETHEREUM,
        apiUrl: ETHEREUM_API_URL,
        explorerHost: ETHERSCAN_HOST,
        hubContractAddress: HUB_ETHEREUM_CONTRACT_ADDRESS.toLowerCase(),
        wrappedNativeContractAddress: WETH_CONTRACT_ADDRESS.toLowerCase(),
    },
    [HUB_NETWORK.BSC]: {
        name: 'Binance Smart Chain',
        shortName: 'BSC',
        coinSymbol: 'BNB',
        chainId: BSC_CHAIN_ID,
        hubChainId: HUB_NETWORK.BSC,
        hubNetworkSlug: HUB_NETWORK.BSC,
        apiUrl: BSC_API_URL,
        explorerHost: BSCSCAN_HOST,
        hubContractAddress: HUB_BSC_CONTRACT_ADDRESS.toLowerCase(),
        wrappedNativeContractAddress: WBNB_CONTRACT_ADDRESS.toLowerCase(),
    },
};

/**
 * @readonly
 * @type {{number: HubChainDataItem}}
 */
export const HUB_CHAIN_BY_ID = Object.fromEntries(Object.values(HUB_CHAIN_DATA).map((item) => [item.chainId, item]));

/**
 * @readonly
 * @enum {string}
 */
export const HUB_TRANSFER_STATUS = {
    not_found_long: 'not_found_long', // custom status
    not_found: 'TX_STATUS_NOT_FOUND',
    deposit_to_hub_received: "TX_STATUS_DEPOSIT_RECEIVED",
    batch_created: "TX_STATUS_BATCH_CREATED",
    batch_executed: "TX_STATUS_BATCH_EXECUTED",
    refund: "TX_STATUS_REFUNDED",
};

/**
 * @readonly
 * @enum {string}
 */
export const HUB_DEPOSIT_TX_PURPOSE = {
    SEND: 'Send',
    UNLOCK: 'Unlock',
    WRAP: 'Wrap',
    UNWRAP: 'Unwrap',
    OTHER: 'Other',
};

export const HUB_COIN_DATA = {
    ETH: {
        testnetSymbol: 'TESTETH',
        smallAmount: 0.0001,
    },
    BNB: {
        testnetSymbol: 'TESTBNB',
        smallAmount: 0.001,
    },
    USDTE: {
        testnetSymbol: 'USDC',
        smallAmount: 0.1,
    },
    HUB: {
        testnetSymbol: 'TESTHUB',
        smallAmount: 0.01,
    },
};

/**
 * Order matters
 * @enum {string}
 */
export const HUB_BUY_STAGE = {
    WAIT_ETH: 'wait_eth',
    SWAP_ETH: 'swap_eth',
    WRAP_ETH: 'wrap_eth',
    UNWRAP_ETH: 'unwrap_eth',
    APPROVE_BRIDGE: 'approve_bridge',
    SEND_BRIDGE: 'send_bridge',
    WAIT_BRIDGE: 'wait_bridge',
    SWAP_MINTER: 'swap_minter',
    FINISH: 'finish',
};

/**
 * @enum {string}
 */
export const HUB_WITHDRAW_SPEED = {
    MIN: 'min',
    FAST: 'fast',
};

/**
 * @readonly
 * @enum {boolean}
 */
export const TX_STATUS = {
    SUCCESS: true,
    FAILURE: false,
};
