<script>
import {prettyRound} from '~/assets/utils.js';

export default {
    props: {
        priceImpact: {
            type: [Number, String],
            required: true,
        },
        priceUnavailable: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        prettyRound,
    },
};
</script>

<template>
    <div class="information information--warning form-row" v-if="priceImpact > 5 || priceUnavailable">
        <template v-if="priceImpact > 5">
            <div class="information__item">
                ⚠️ {{ $td('High price impact!', 'portfolio.warning-price-impact') }}
                <div class="information__value">{{ prettyRound(priceImpact) }}%</div>
            </div>
            <div class="information__item information__item--content information__muted u-text-medium">
                {{ $t('portfolio.warning-price-impact-description', {impact: prettyRound(priceImpact)}) }}
            </div>
        </template>
        <template v-else-if="priceUnavailable">
            <div class="information__item">
                ⚠️ {{ $td('Can\'t calculate price impact', 'portfolio.warning-price-impact-unavailable') }}
            </div>
            <div class="information__item information__item--content information__muted u-text-medium">
                {{ $td('Please double check resulting amounts. You may lose part of coins because of fees and/or low liquidity pools involved in swaps', 'portfolio.warning-price-impact-unavailable-description') }}
            </div>
        </template>
    </div>
</template>
