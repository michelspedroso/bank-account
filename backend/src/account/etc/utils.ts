import { BadRequestException } from "@nestjs/common";
import { ER_LOW_BALANCE } from "./constants";

export const BalenceUtils = {
  create(value: number) {
    return {
      value: Math.round(value),
      formatted: this.format(value)
    };
  },

  format(value: number): string {
    return `R$ ${(value / 100)
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  },
  
  add(valueA: number, valueB: number): number {
    return valueA + valueB;
  },

  subtract(valueA: number, valueB: number): number {
    const total = valueA - valueB;
    if (total < 0) {
      throw new BadRequestException(ER_LOW_BALANCE);
    }

    return total;
  }
};
