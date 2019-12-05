/**
 * Custom helper to obtain the return type of an async function type.
 *
 * Based on ReturnType<T> from TypeScript.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer R>
	? R
	: any
