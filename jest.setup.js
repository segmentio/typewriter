const originalConsoleError = console.error
// eslint-disable-next-line no-undef
const supressLog = (...args) => {
  // avoid Warning: No API token found at test-env/build
  if (typeof args[0] === 'string' && args[0].includes('API token')) {
    return undefined
  } else {
    originalConsoleError(...args)
  }
}

console.error = supressLog
