export default class Timeout {
    private static ref_count;
    private static readonly MAX_TIMEOUT;
    private static dummy_timeout;
    private static entries;
    private readonly created_at;
    private readonly delay;
    private readonly repeat;
    private readonly callback;
    private readonly args;
    private is_ref;
    private readonly key;
    private is_extended;
    private internal_timeout;
    constructor(repeat: boolean, is_ref: boolean, callback: (...a: typeof args) => void, delay: number, args: any[]);
    static main(): void;
    static clear(timeoutId: string | NodeJS.Timeout | Timeout | undefined): void;
    private static inc_ref;
    private static dec_ref;
    hasRef(): boolean;
    ref(): Timeout;
    unref(): Timeout;
    [Symbol.dispose](): void;
    [Symbol.toPrimitive](): string;
    private dispatch;
}
