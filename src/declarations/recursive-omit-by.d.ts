declare module 'recursive-omit-by' {
  export default function recursiveOmitBy(object: object, callback: (object: { node: any, key: string }) => boolean)
}
