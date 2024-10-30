export default class Timeout {
    private readonly created_at;
    private readonly delay;
    private readonly repeat;
    private readonly callback;
    private readonly args;
    private is_ref;
    private readonly key;
    private is_extended;
    private internal_timeout;
    static ref_count: number;
    static readonly MAX_TIMEOUT = 2147483647;
    static dummy_timeout: NodeJS.Timeout;
    static entries: Record<string, Timeout>;
    constructor(repeat: boolean, is_ref: boolean, callback: (...a: typeof args) => void, delay: number, args: any[]);
    hasRef(): boolean;
    ref(): Timeout;
    unref(): Timeout;
    [Symbol.dispose](): void;
    [Symbol.toPrimitive](): string;
    private static inc_ref;
    private static dec_ref;
    private dispatch;
    static main(): void;
}
