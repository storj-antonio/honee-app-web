import axios from 'axios';
import {NATIVE_COIN_ADDRESS, ZERO_X_API_URL} from "~/assets/variables.js";
import addToCamelInterceptor from '~/assets/axios-to-camel.js';
import {getMaxEstimationLimit, getMinEstimationLimit} from '~/assets/utils/swap-limit.js';
import {buildApproveTx, getAllowance} from '~/api/web3.js';
import Big from '~/assets/big.js';

const instance = axios.create({
    baseURL: ZERO_X_API_URL,
});
// addToCamelInterceptor(instance);

/**
 * @param {number|string} chainId
 * @param {ZeroXSwapParams} swapParams
 * @return {Promise<ZeroXSwapResponse>}
 */
export function _buildTxForSwap(chainId, swapParams) {
    return instance.get('swap/v1/quote', {
        params: swapParams,
    })
        .then((response) => {
            return response.data;
        });
}

/**
 * @param {number|string} chainId
 * @param {ZeroXSwapParams&{receiver?: string}} swapParams
 * @return {Promise<{txList: Array<OneInchTx>, swapLimit: string}>}
 */
export async function buildTxForSwap(chainId, swapParams) {
    const txList = [];

    // swap
    const swapTx = await _buildTxForSwap(chainId, swapParams);
    // if (swapParams.sellAmount) {
    //     response.data.minBuyAmount = calculateEstimationLimit(swapParams, swapTx);
    // } else {
    //     response.data.maxSellAmount = calculateEstimationLimit(swapParams, swapTx);
    // }
    const swapLimit = calculateEstimationLimit(swapParams, swapTx);
    const maxSellAmount = swapParams.sellAmount ? swapParams.sellAmount : swapLimit;

    // allowance
    if (swapParams.sellToken !== NATIVE_COIN_ADDRESS) {
        const allowance = await getAllowance(chainId, swapParams.sellToken, swapParams.takerAddress, swapTx.allowanceTarget);
        if (new Big(allowance).lt(maxSellAmount)) {
            txList.push(buildApproveTx(swapParams.sellToken, swapTx.allowanceTarget));
        }
    }

    txList.push(swapTx);
    if (swapParams.receiver) {
        txList.push({
            to: swapParams.receiver,
            //@TODO if buyToken is erc20 token use transferToken method of erc20 contract
            value: swapTx.buyAmount,
            data: '0x',
        });
    }

    return {
        swapLimit,
        txList,
    };
}

/**
 * @param {number|string} chainId
 * @param {ZeroXSwapParams} swapParams
 * @return {Promise<ZeroXPriceResponse>}
 */
export function getPrice(chainId, swapParams) {
    return instance.get('swap/v1/price', {
            params: swapParams,
        })
        .then((response) => {
            return response.data;
        });
}

/**
 * @param {number} chainId
 * @param {ZeroXSwapParams} swapParams
 * @return {Promise<string|number>}
 */
export function getEstimationLimit(chainId, swapParams) {
    return getPrice(chainId, swapParams)
        .then((priceData) => {
            return calculateEstimationLimit(swapParams, priceData);
        });
}

/**
 * @param {ZeroXSwapParams} swapParams
 * @param {ZeroXPriceResponse} priceData
 * @return {string}
 */
function calculateEstimationLimit(swapParams, priceData) {
    const estimation = swapParams.sellAmount ? priceData.buyAmount : priceData.sellAmount;
    const getLimit = swapParams.sellAmount ? getMinEstimationLimit : getMaxEstimationLimit;
    return getLimit(estimation, swapParams.slippagePercentage);
}

/**
 * @typedef {object} ZeroXSwapParams
 * @property {string} buyToken - token address the taker wants to buy
 * @property {string} sellToken - token address the taker wants to sell
 * @property {string} [buyAmount] - amount of the buy token, if the taker is requesting to buy
 * @property {string} [sellAmount] - amount of the sell token, if the taker is requesting to sell
 * // OPTIONAL PARAMETERS
 * @property {number|string} slippagePercentage - e.g 0.03 for 3% slippage allowed.
 * // The address which will fill the quote.
 * // When provided the gas will be estimated and returned and the entire transaction will be validated for success.
 * // If the validation fails a Revert Error will be returned in the response.
 * // Required for RFQ liquidity
 * @property {string} takerAddress
 */

/**
 * @typedef {object} ZeroXPriceResponse
 * @property {string} buyAmount
 * @property {string} sellAmount
 */

/**
 * @typedef {ZeroXPriceResponse & OneInchTx} ZeroXSwapResponse
 * @property {string} allowanceTarget
 */

