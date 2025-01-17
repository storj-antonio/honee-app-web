import axios from 'axios';
import {ONE_INCH_API_URL, NETWORK, MAINNET} from "~/assets/variables.js";
import addToCamelInterceptor from '~/assets/axios-to-camel.js';
import {fromErcDecimals} from '~/api/web3.js';

const instance = axios.create({
    baseURL: ONE_INCH_API_URL,
});
// addToCamelInterceptor(instance);

/**
 * @param {number|string} chainId
 * @param {OneInchExchangeControllerGetSwapParams} swapParams
 * @return {Promise<OneInchTx>}
 */
export function buildTxForSwap(chainId, swapParams) {
    return instance.get(`${chainId}/swap`, {
        params: swapParams,
    })
        .then((response) => {
            return response.data.tx;
        });
}

/**
 * @param {number|string} chainId
 * @param {OneInchExchangeControllerGetQuoteParams} swapParams
 * @return {Promise<{estimatedGas: number, estimatedAmount: string}>}
 */
export function getQuoteForSwap(chainId, swapParams) {
    return instance.get(`${chainId}/quote`, {
            params: swapParams,
        })
        .then((response) => {
            /** @type {OneInchQuoteResponseDto} */
            const responseData = response.data;
            const estimatedAmount = fromErcDecimals(responseData.toTokenAmount, responseData.toToken.decimals);
            return {
                estimatedAmount,
                estimatedGas: responseData.estimatedGas,
            };
        });
}
