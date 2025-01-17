import axios from 'axios';
import {HUB_DEPOSIT_PROXY_API_URL, HUB_DEPOSIT_PROXY_CONTRACT_ADDRESS, NETWORK, MAINNET} from "~/assets/variables.js";
import addToCamelInterceptor from '~/assets/axios-to-camel.js';

const instance = axios.create({
    baseURL: HUB_DEPOSIT_PROXY_API_URL,
});
addToCamelInterceptor(instance);

/**
 * build tx to proxy contract which will swap on 1inch and deposit result to Minter via Hub
 * @param {number|string} chainId
 * @param {OneInchExchangeControllerGetSwapParams&{destination: string, refundTo?: string}} swapParams
 * @return {Promise<{toTokenAmount: string, txList: Array<OneInchTx>, steps: object}>}
 */
export function buildTxForSwap(chainId, swapParams) {
    return instance.get(`new/swap`, {
        params: {
            // destReceiver: HUB_DEPOSIT_PROXY_CONTRACT_ADDRESS,
            ...swapParams,
            refundTo: swapParams.refundTo || swapParams.destination,
        },
    })
        .then((response) => {
            return {
                ...response.data,
                txList: response.data.steps.map((item) => item.tx),
            };
        });
}
