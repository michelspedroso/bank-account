import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { BalenceUtils } from "./../../account/etc/utils";

@Injectable()
export class PriceInterceptor implements NestInterceptor {
    constructor() { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map((target) => this.scanAndTransform(target)));
    }

    private scanAndTransform(target: any) {
        Object.keys(target).forEach((propertyKey) => {
            const ref = target[propertyKey];
            if (ref === null || ref === undefined) {
                return;
            }
            const { value, balance } = ref;
            if (value) {
                ref.formatedValue = BalenceUtils.create(ref.value).formatted;
            }
            if (balance) {
                ref.formatedBalance = BalenceUtils.create(ref.balance).formatted;
            }
            if (typeof ref === 'object') {
                this.scanAndTransform(ref);
            }
        });
        return target;
    }
}
