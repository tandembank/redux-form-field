// Example interfaces:
//
//     interface A {
//         a: string,
//         b: string,
//         c: number;
//     }
//
//     interface B {
//         b: string,
//         c: string;
//     }

// Creates a new union type
// With all the commonly shared keys
// e.g. SharedKeys<A, B> = 'b' | 'c'
export type SharedKeys<T, U> = Extract<keyof T, keyof U>;

// Creates a new type
// With all the commonly shared keys between T and U
// Where those key values share the same type
// e.g. TypeOverlap<A, B> = { b: string, c: number }
export type Overlap<T, U> = Pick<T, SharedKeys<T, U>>;

// Creates a new union type
// With all the commonly shared keys
// Where the value types also match
// e.g. SharedTypedKeys<A, B> = 'b'
export type SharedTypedKeys<T, U> = {
    [K in SharedKeys<T, U>]: U[K] extends T[K] ? K : never
}[SharedKeys<T, U>];

// Creates a new type
// With all the commonly shared keys between T and U
// Where those key values share the same type
// e.g. TypeOverlap<A, B> = { b: string }
export type TypeOverlap<T, U> = Pick<T, SharedTypedKeys<T, U>>;

// Creates a new type
// With key K removed from type T
// e.g. Omit<A, 'b'> = { a: string, c: number }
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// Creates a new type
// With all the overlapping keys of U removed from T
// e.g. OmitOverlap<A, B> = { a: string }
export type OmitOverlap<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
