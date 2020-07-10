import {
  ValidationArguments,
  ValidatorConstraintInterface
} from 'class-validator';
import { REGEX_BANK_ACCOUNT } from './constants';

export class IsBankAccountConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    const regex = REGEX_BANK_ACCOUNT;
    if (value.match(regex)) {
      return true;
    }

    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments) {
    return 'Must be a valid bank account';
  }
}
