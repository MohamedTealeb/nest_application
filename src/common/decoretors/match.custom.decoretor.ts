
import{ registerDecorator, Validate, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({name:"match_between_fields", async:true})
export class MatchBetween implements ValidatorConstraintInterface {
    validate(value:any, args:ValidationArguments){
        console.log({value,args,matchWith:args.constraints[0],matchWithValue:args.object[args.constraints[0]]});
            return value===args.object[args.constraints[0]];
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Passwords do not match';
    }
}
export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints,
      validator: MatchBetween,
    });
  };
}
