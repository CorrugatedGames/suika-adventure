import { StateContext } from '@ngxs/store';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IAttachment {
  action: any;
  handler: (ctx: StateContext<any>, action?: any) => void;
}
