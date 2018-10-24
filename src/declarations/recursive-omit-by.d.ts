declare module 'recursive-omit-by' {
  export default function recursiveOmitBy(object: Object, callback: (object: { node: any, key: string }) => boolean)
}
