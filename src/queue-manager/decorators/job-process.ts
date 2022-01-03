import { ProcessOptions } from '@nestjs/bull/dist/decorators/process.decorator';
import { AsyncMethodDecorator } from '../../mixins/interfaces/async-method-decorator';
import { JOB_PROCESS_META } from '../constants';

export function JobProcess(nameOrOptions: ProcessOptions | string): AsyncMethodDecorator {
  const options = typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions;
  return Reflect.metadata(JOB_PROCESS_META, options);
}
