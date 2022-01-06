export type ILimits<Type> = {
  [Property in keyof Type as `${Uppercase<
    string & Property
  >}_MAX_DISTANCE`]: number;
};
