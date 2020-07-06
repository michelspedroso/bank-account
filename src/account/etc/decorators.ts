import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsBankAccountConstraint } from './is-bank-account-constraint';

export function IsBankAccount(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBankAccountConstraint
    });
  };
}
