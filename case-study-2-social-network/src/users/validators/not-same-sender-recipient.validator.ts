import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'NotSameSenderAndRecipient', async: false })
export class NotSameSenderAndRecipientConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const { senderId, recipientId } = args.object as {
      senderId?: string;
      recipientId?: string;
    };

    if (!senderId || !recipientId) {
      return true;
    }

    return senderId !== recipientId;
  }

  defaultMessage(args: ValidationArguments): string {
    return (
      (args.constraints[0] as string | undefined) ??
      'Sender and recipient must be different users'
    );
  }
}

export function NotSameSenderAndRecipient(
  message: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [message],
      validator: NotSameSenderAndRecipientConstraint,
    });
  };
}
