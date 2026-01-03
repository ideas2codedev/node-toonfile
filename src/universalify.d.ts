declare module 'universalify' {
  export function fromCallback<T extends (...args: any[]) => any>(fn: T): T
  export function fromPromise<T extends (...args: any[]) => Promise<any>>(fn: T): T & {
    (...args: [...Parameters<T>, (err: Error | null, result?: any) => void]): void
  }
}
