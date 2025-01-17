import {isValidMnemonic, walletFromMnemonic} from 'minterjs-wallet';
import {getAvatarUrl, shortHashFilter} from "~/assets/utils";
import {COIN_NAME, CHAIN_ID} from '~/assets/variables.js';

export default {
    /**
     * Checks if user is authorized
     * @return {boolean}
     */
    isAuthorized(state) {
        return state.auth && isValidMnemonic(state.auth);
    },
    wallet(state, getters) {
        if (getters.isAuthorized) {
            return walletFromMnemonic(state.auth);
        }
        return null;
    },
    address(state, getters) {
        if (getters.wallet) {
            return getters.wallet.getAddressString();
        } else {
            return '';
        }
    },
    evmAddress(state, getters) {
        return getters.address.replace('Mx', '0x');
    },
    // addressUrl(state, getters) {
    //     return getExplorerAddressUrl(getters.address);
    // },
    mnemonic(state, getters) {
        return getters.isAuthorized ? state.auth : '';
    },
    privateKey(state, getters) {
        return getters.wallet ? getters.wallet.getPrivateKeyString() : '';
    },
    username(state, getters) {
        if (!getters.address.length) {
            return '';
        }
        return '…' + getters.address.slice(-4);
    },
    // usernameLetter(state, getters) {
    //     return getNameLetter(getters.username);
    // },
    avatar(state, getters) {
        const avatarByAddress = getters.address ? getAvatarUrl(getters.address) : '';
        // stored avatar first, bc. it can be changed manually after uploading new
        return avatarByAddress;
    },
    getBalanceItem(state) {
        return function(coinSymbol) {
            return state.balance.find((balanceItem) => {
                return balanceItem.coin.symbol === coinSymbol;
            });
        };
    },
    getBalanceAmount(state, getters) {
        return function(coinSymbol) {
            const selectedBalanceItem = getters.getBalanceItem(coinSymbol);
            // coin not selected
            if (!selectedBalanceItem) {
                return 0;
            }
            return selectedBalanceItem.amount;
        };
    },
    baseCoinAmount(state, getters) {
        return getters.getBalanceAmount(COIN_NAME);
    },
    /**
     * @return {string}
     */
    BASE_COIN() {
        return COIN_NAME;
    },
    /**
     * @return {string}
     */
    COIN_NAME() {
        return COIN_NAME;
    },
    CHAIN_ID() {
        return CHAIN_ID;
    },
};
