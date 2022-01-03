import { Inject, Optional } from "@nestjs/common";
import { SentryService } from "@ntegral/nestjs-sentry";
import { AsyncMethodDecorator } from "../interfaces/async-method-decorator";

export function CatchErrorWithSentry(
  sentryInstanceKey = "__sentry",
  bubble = true
): AsyncMethodDecorator {
  const injectLogger = Inject(SentryService);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    if (!target[sentryInstanceKey]) {
      try {
        injectLogger(target, sentryInstanceKey);
        Optional()(target, sentryInstanceKey);
      } catch (e) {}
    }

    // get original method
    const originalMethod = propertyDescriptor.value;

    // redefine descriptor value within own function block
    propertyDescriptor.value = async function (...args: any[]): Promise<any> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const sentry: SentryService = this[sentryInstanceKey];
        const targetName =
          typeof target === "function" ? target.name : target.constructor.name;
        error = typeof error === "string" ? new Error(error) : error;
        error.message = `${targetName}::${propertyKey} ${error.message}`;
        if (sentry) {
          // TODO: send to sentry
          sentry.log(`${error.message}\nError stack: ${error.stack}`);
        }

        // rethrow error, so it can bubble up
        if (bubble) {
          throw error;
        }
      }
    };
  };
}
