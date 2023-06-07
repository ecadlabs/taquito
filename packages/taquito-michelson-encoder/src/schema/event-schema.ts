import { MichelsonV1Expression, MichelsonV1ExpressionExtended, ScriptResponse } from '@taquito/rpc';
import { deepEqual } from './storage';

export class EventSchema {
  constructor(public readonly tag?: string, public readonly type?: MichelsonV1ExpressionExtended) {}

  static fromMichelineValue(val: MichelsonV1ExpressionExtended) {
    return new EventSchema(val.annots?.[0], val.args?.[0] as MichelsonV1ExpressionExtended);
  }

  static fromRPCResponse(val: { script: ScriptResponse }): EventSchema[] {
    const allEventSchema: EventSchema[] = [];
    val.script.code.forEach((code) => {
      if (!('prim' in code) || code.prim !== 'code' || !('args' in code) || !code.args) {
        return;
      }
      allEventSchema.push(...EventSchema.extractEventsRecursively(code.args));
    });
    return EventSchema.removeDuplicates(allEventSchema);
  }

  static removeDuplicates(events: EventSchema[]): EventSchema[] {
    const uniqueEvents: EventSchema[] = [];
    events.forEach((event) => {
      const idx = uniqueEvents.findIndex(
        (e) => e.tag === event.tag && deepEqual(e.type, event.type)
      );
      if (idx === -1) {
        uniqueEvents.push(event);
      }
    });
    return uniqueEvents;
  }

  static extractEventsRecursively(code: MichelsonV1Expression): EventSchema[] {
    if (Array.isArray(code)) {
      return code.flatMap((c) => EventSchema.extractEventsRecursively(c));
    }
    if (!('prim' in code)) {
      return [];
    }
    if (code.prim === 'EMIT') {
      return [EventSchema.fromMichelineValue(code)];
    }
    if (!('args' in code) || !code.args) {
      return [];
    }
    return code.args.flatMap((c) => EventSchema.extractEventsRecursively(c));
  }
}
