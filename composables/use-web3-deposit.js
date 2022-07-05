import {reactive, computed, watch} from '@vue/composition-api';

import {subscribeTransfer} from '~/api/hub.js';
import {getProviderByChain, web3Utils, toErcDecimals} from '~/api/web3.js';
import {getTransaction} from '~/api/explorer.js';
import {HUB_BUY_STAGE as LOADING_STAGE, HUB_CHAIN_BY_ID, HUB_TRANSFER_STATUS, MAINNET, NETWORK} from '~/assets/variables.js';
import Big from '~/assets/big.js';
import wethAbi from '~/assets/abi-weth.js';
import hubABI from '~/assets/abi-hub.js';
import useWeb3TokenBalance from '~/composables/use-web3-token-balance.js';
import useTxService from '~/composables/use-tx-service.js';

const GAS_LIMIT_SWAP = 200000;
const GAS_LIMIT_WRAP = 50000;
const GAS_LIMIT_UNWRAP = 50000;
const GAS_LIMIT_UNLOCK = 75000;
const GAS_LIMIT_BRIDGE = 75000;


const { tokenContractAddress: tokenAddress, tokenDecimals, isNativeToken, nativeBalance, setTokenProps } = useWeb3TokenBalance();
const { txServiceState, sendEthTx, addStepData, waitPendingStep } = useTxService();

/**
 * @type {import('@vue/composition-api').UnwrapRef<{amount: number, tokenSymbol: string, accountAddress: string, destinationMinterAddress: string, chainId: number, hubCoinList: Array<HubCoinItem>, priceList: Array<Object>}>}
 */
const props = reactive({
    destinationMinterAddress: '',
    accountAddress: '',
    chainId: 0,
    amount: 0,
    tokenSymbol: '',
    /** @type Array<HubCoinItem> */
    hubCoinList: [],
    priceList: [],
});

/**
 * @param {{amount?: number, tokenSymbol?: string, accountAddress?: string, destinationMinterAddress?: string, chainId?: number, hubCoinList?: Array<HubCoinItem>, priceList?: Array<Object>}} newProps
 */
function setProps(newProps) {
    Object.assign(props, newProps);
    setTokenProps({
        tokenSymbol: newProps.tokenSymbol,
        accountAddress: newProps.accountAddress,
        chainId: newProps.chainId,
        hubCoinList: newProps.hubCoinList,
    });
}

const state = reactive({

});

function getHubContractAddress() {
    return HUB_CHAIN_BY_ID[props.chainId]?.hubContractAddress;
}
function getWrappedNativeContractAddress() {
    return HUB_CHAIN_BY_ID[props.chainId]?.wrappedNativeContractAddress;
}

/**
 * @type {import('@vue/composition-api').ComputedRef<HubChainDataItem>}
 */
// const hubChainData = computed(() => HUB_CHAIN_BY_ID[props.chainId]);

const amountToUnwrap = computed(() => {
    const amountToUnwrapMinimum = new Big(props.amount || 0).minus(nativeBalance.value).toString();
    if (amountToUnwrapMinimum <= 0) {
        return 0;
    }
    return /*this.form.isUnwrapAll ? this.selectedWrapped : */amountToUnwrapMinimum;
});
/**
 * Disabled sending wrapped ERC-20 WETH directly
 * it may save 5-10k of gas ($1-2), but not worth it, because of complicated codebase and need of native ETH predictions to pay fee
 * @type {import('@vue/composition-api').ComputedRef<boolean>}
 */
const isUnwrapRequired = computed(() => {
    if (!isNativeToken.value) {
        return false;
    }

    return amountToUnwrap.value > 0;
});
//@TODO move from HubBuy
const isApproveRequired = computed(() => {
    return false;
});

// @TODO gasPrice not updated during isFormSending and may be too low/high after waiting pin gasPrice on submit
// @TODO use *network*_fee instead of 'prices'
// @TODO use web3.eth.getGasPrice for testnet @see https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#getgasprice
const gasPriceGwei = computed(() => {
    const selectedHubNetwork = HUB_CHAIN_BY_ID[props.chainId]?.hubChainId;
    const priceItem = props.priceList.find((item) => item.name === `${selectedHubNetwork}/gas`);
    let gasPriceGwei;
    if (!priceItem) {
        gasPriceGwei = 100;
    } else {
        gasPriceGwei = priceItem.value;
    }

    // return NETWORK === MAINNET ? gasPriceGwei : 5;
    // eslint-disable-next-line no-unreachable
    return NETWORK === MAINNET ? gasPriceGwei : new Big(gasPriceGwei).times(10).toNumber();
});
const gasTotalFee = computed(() => {
    const unwrapGasLimit = isUnwrapRequired.value ? GAS_LIMIT_UNWRAP : 0;
    const unlockGasLimit = isApproveRequired.value ? GAS_LIMIT_UNLOCK : 0;
    const totalGasLimit = /*GAS_LIMIT_SWAP + */unwrapGasLimit + unlockGasLimit + GAS_LIMIT_BRIDGE;
    // gwei to ether
    const gasPrice = web3Utils.fromWei(web3Utils.toWei(gasPriceGwei.value.toString(), 'gwei'), 'ether');

    return new Big(gasPrice).times(totalGasLimit).toString();
});
const depositAmountAfterGas = computed(() => {
    let amount = new Big(props.amount || 0).minus(gasTotalFee.value);
    amount = amount.gt(0) ? amount.toString() : 0;
    return amount;
});



async function depositFromEthereum() {
    const web3Eth = getProviderByChain(props.chainId);
    //@TODO properly work with nonce via queue service
    let nonce = await web3Eth.getTransactionCount(props.accountAddress, 'latest');
    const gasPrice = gasPriceGwei.value;

    // txServiceState.loadingStage = LOADING_STAGE.SWAP_ETH;
    // addStepData(LOADING_STAGE.SWAP_ETH, {coin0: 'ETH', amount0: props.amount, coin1: props.tokenSymbol});

    let unwrapPromise;
    if (isUnwrapRequired.value) {
        unwrapToNativeCoin({nonce, gasPrice});
        unwrapPromise = waitPendingStep(LOADING_STAGE.UNWRAP_ETH);
    }

    // const swapPromise = sendUniswapTx({nonce, gasPrice: gasPriceGwei.value});

    // if `approve` step exists, then process sendApproveTx to ensure it finished
    // if (!this.isCoinApproved || txServiceState.steps[LOADING_STAGE.APPROVE_BRIDGE]) {
    //     if (!txServiceState.loadingStage) {
    //         txServiceState.loadingStage = LOADING_STAGE.APPROVE_BRIDGE;
    //     }
    //     addStepData(LOADING_STAGE.APPROVE_BRIDGE, {coin: props.tokenSymbol});
    //     nonce = nonce + 1;
    //     sendApproveTx({nonce, gasPrice: gasPriceGwei.value + 1});
    // }

    const unwrapReceipt = unwrapPromise ? await unwrapPromise : Promise.resolve({nonce: nonce - 1});
    // const swapReceipt = await swapPromise;
    // const outputAmount = getSwapOutput(swapReceipt);
    // if (!(outputAmount > 0)) {
    //     throw new Error(`Received 0 ${props.tokenSymbol} from uniswap`);
    // }
    // const outputAmountHumanReadable = fromErcDecimals(outputAmount, tokenDecimals.value);
    // addStepData(LOADING_STAGE.SWAP_ETH, {amount1: outputAmountHumanReadable});

    txServiceState.loadingStage = LOADING_STAGE.SEND_BRIDGE;
    addStepData(LOADING_STAGE.SEND_BRIDGE, {coin: props.tokenSymbol, amount: depositAmountAfterGas.value});
    const depositNonce = txServiceState.steps[LOADING_STAGE.APPROVE_BRIDGE] ? unwrapReceipt.nonce + 2 : unwrapReceipt.nonce + 1;
    sendCoinTx({nonce: depositNonce, gasPrice});
    const depositReceipt = await waitPendingStep(LOADING_STAGE.SEND_BRIDGE);

    txServiceState.loadingStage = LOADING_STAGE.WAIT_BRIDGE;
    addStepData(LOADING_STAGE.WAIT_BRIDGE, {coin: props.tokenSymbol /* calculate receive amount? */});
    return subscribeTransfer(depositReceipt.transactionHash)
        .then((transfer) => {
            if (transfer.status !== HUB_TRANSFER_STATUS.batch_executed) {
                throw new Error(`Unsuccessful bridge transfer: ${transfer.status}`);
            }
            console.log('transfer', transfer);
            return getTransaction(transfer.outTxHash);
        })
        .then((minterTx) => {
            console.log('minterTx', minterTx);

            if (!minterTx.data.list) {
                throw new Error('Minter tx transfer has invalid data');
            }
            const multisendItem = minterTx.data.list.find((item) => item.to === props.destinationMinterAddress && item.coin.symbol === props.tokenSymbol);
            if (!multisendItem) {
                throw new Error(`Minter tx transfer does not include ${props.tokenSymbol} deposit to the current user`);
            }

            const outputAmount = multisendItem.value;
            addStepData(LOADING_STAGE.WAIT_BRIDGE, {amount: outputAmount, tx: minterTx, finished: true});

            return outputAmount;
        });
}

function unwrapToNativeCoin({nonce, gasPrice} = {}) {
    const web3Eth = getProviderByChain(props.chainId);
    txServiceState.loadingStage = LOADING_STAGE.UNWRAP_ETH;
    addStepData(LOADING_STAGE.UNWRAP_ETH, {amount: amountToUnwrap.value});

    const amountToUnwrapWei = toErcDecimals(amountToUnwrap.value, tokenDecimals.value);
    const wrappedNativeContract = new web3Eth.Contract(wethAbi, getWrappedNativeContractAddress());
    const data = wrappedNativeContract.methods.withdraw(amountToUnwrapWei).encodeABI();
    return sendEthTx({
        to: getWrappedNativeContractAddress(),
        data,
        nonce,
        gasPrice,
        gasLimit: GAS_LIMIT_UNWRAP,
    }, LOADING_STAGE.UNWRAP_ETH);
    // .then((hash) => {
    //     this.waitUnwrapConfirmation = true;
    //
    //     return hash;
    // });
}

// function sendApproveTx({nonce, gasPrice} = {}) {
//     let amountToUnlock = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
//     let data = erc20Contract(tokenAddress.value).methods.approve(getHubContractAddress(), amountToUnlock.value).encodeABI();
//
//     return sendEthTx({to: tokenAddress.value, data, nonce, gasPrice, gasLimit: GAS_LIMIT_UNLOCK}, LOADING_STAGE.APPROVE_BRIDGE);
// }


// function sendUniswapTx({nonce, gasPrice} = {}) {
//     const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
//     const poolAddress = this.uniswapPair.liquidityToken.address;
//     const poolContract = new web3.eth.Contract(uniswapV2Abi, poolAddress);
//     const amountOutMin = toErcDecimals(new Big(this.uniswapEstimation.output).times(0.97).toString(), tokenDecimals.value);
//     // console.log('amountOutMin', new Big(this.uniswapEstimation.output).times(0.97).toString(), amountOutMin)
//     const deadline = Math.floor(Date.now() / 1000) + 60 * 30; // 30min
//     const data = poolContract.methods.swapExactETHForTokens(amountOutMin, [wethToken.address, tokenAddress.value], props.accountAddress, deadline).encodeABI();
//
//     return sendEthTx({to: routerAddress, data, value: this.ethToSwap, nonce, gasPrice, gasLimit: GAS_LIMIT_SWAP}, LOADING_STAGE.SWAP_ETH);
// }


function sendCoinTx({nonce, gasPrice}) {
    const web3Eth = getProviderByChain(props.chainId);
    const address = Buffer.concat([Buffer.alloc(12), Buffer.from(web3Utils.hexToBytes(props.destinationMinterAddress.replace("Mx", "0x")))]);
    const destinationChain = Buffer.from('minter', 'utf-8');
    const hubContract = new web3Eth.Contract(hubABI, getHubContractAddress());
    let txParams;
    if (isNativeToken.value) {
        txParams = {
            value: depositAmountAfterGas.value,
            data: hubContract.methods.transferETHToChain(
                destinationChain,
                address,
                0,
            ).encodeABI(),
        };
    } else {
        txParams = {
            data: hubContract.methods.transferToChain(
                tokenAddress.value,
                destinationChain,
                address,
                toErcDecimals(depositAmountAfterGas.value, tokenDecimals.value),
                0,
            ).encodeABI(),
        };
    }

    return sendEthTx({
        to: getHubContractAddress(),
        ...txParams,
        nonce,
        gasPrice,
        gasLimit: GAS_LIMIT_BRIDGE,
    }, LOADING_STAGE.SEND_BRIDGE);
}


export default function useWeb3Deposit(destinationMinterAddress) {
    props.destinationMinterAddress = destinationMinterAddress;

    return {
        // computed
        amountToUnwrap,
        isUnwrapRequired,
        isApproveRequired,
        gasPriceGwei,
        gasTotalFee,
        depositAmountAfterGas,
        // methods
        setDepositProps: setProps,
        depositFromEthereum,
    };
}
