export const BalenceUtils = {
    create(value: number) {
        return {
            value: Math.round(value),
            formatted: this.format(value),
        };
    },

    format(value: number): string {
        return `R$ ${(value / 100)
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    },
};