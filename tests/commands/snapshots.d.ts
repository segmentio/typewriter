/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R> {
    toMatchFile: (filename: string) => void
  }

  interface Expect {
    toMatchFile: (filename: string) => void
  }
}
