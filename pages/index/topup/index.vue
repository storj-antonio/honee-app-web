<script>
import getTitle from '~/assets/get-title.js';
import {CARD_TO_MINTER_HOST, NETWORK, MAINNET} from '~/assets/variables.js';
import Modal from '~/components/base/Modal.vue';
import {getCard2MinterUrl} from '~/assets/utils.js';

export default {
    CARD_TO_MINTER_HOST,
    components: {
        Modal,
    },
    head() {
        const title = getTitle(this.$td('Top up your balance', 'topup.title'));

        return {
            title,
            meta: [
                { hid: 'og-title', name: 'og:title', content: title },
            ],
        };
    },
    data() {
        return {
        };
    },
    computed: {
        card2MinterUrl() {
            return getCard2MinterUrl(this.$store.getters.address, window.location.origin);
        },
        isMainnet() {
            return NETWORK === MAINNET;
        },
    },
    methods: {
    },
};
</script>

<template>
    <Modal
        class="u-text-center"
        :isOpen="true"
        :hideCloseButton="false"
        :disableOutsideClick="false"
        @modal-close="$router.push(getDashboardUrl())"
    >
        <h1 class="u-h3 u-mb-025">
            {{ $td('Top up your balance', 'topup.title') }}
        </h1>
        <p>{{ $td('Choose one of these options', 'topup.description') }}</p>

        <a class="button button--full u-mt-10" :href="card2MinterUrl" v-if="isMainnet">
            <img class="button__icon" src="/img/icon-topup-card.svg" alt="" role="presentation">
            {{ $td('Card to card', 'topup.top-up-with-card2card') }}
        </a>
        <nuxt-link class="button button--full u-mt-10" :to="$i18nGetPreferredPath('/topup/bsc')">
            <img class="button__icon" src="/img/icon-topup-bnb.svg" alt="" role="presentation">
            {{ $td('Top up with BNB', 'topup.top-up-with-network', {network: 'BNB'}) }}
        </nuxt-link>
        <nuxt-link class="button button--full u-mt-10" :to="$i18nGetPreferredPath('/topup/ethereum')">
            <img class="button__icon" src="/img/icon-topup-eth.svg" alt="" role="presentation">
            {{ $td('Top up with ETH', 'topup.top-up-with-network', {network: 'ETH'}) }}
        </nuxt-link>
        <nuxt-link class="button button--full u-mt-10" :to="$i18nGetPreferredPath('/topup/minter')">
            <img class="button__icon" src="/img/icon-topup-minter.svg" alt="" role="presentation">
            {{ $td('Top up with Minter', 'topup.top-up-with-network', {network: 'Minter'}) }}
        </nuxt-link>

        <nuxt-link class="button button--ghost button--full u-mt-10" :to="getDashboardUrl()">
            {{ $td('Cancel', 'topup.cancel') }}
        </nuxt-link>
    </Modal>
</template>
