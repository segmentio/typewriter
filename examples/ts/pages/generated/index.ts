/**
 *  This client was generated from a Tracking Plan schema; ** Do Not Edit **
 *
 *  Tracking Plan: 
 */

 declare global {
  interface Window { analytics: any; }
}

function getType(val: any) {
  return Object.prototype.toString.call(val).slice(8, -1);
};

function isArray(val: any) {
  return getType(val) === 'Array'
}

function isNumber(val: any) {
  return getType(val) === 'Number'
}

function isString(val: any) {
  return getType(val) === 'String'
}

function isObject(val: any) {
  return getType(val) === 'Object'
}

function isBoolean(val: any) {
  return getType(val) === 'Boolean'
}

function isUndefined(val: any) {
  return getType(val) === 'Undefined'
}

function validateObj(obj: any, propDescriptors: any) {
  if (!isObject(obj)) {
    throw new TypeError(`Properties must be provided as an object`)
  }
  // Check for unplanned properties
  Object.keys(obj).forEach(k => {
    if (!propDescriptors[k]) {
      throw new Error(
        `Unplanned property ${k} is not in the Tracking Plan,
        visit https://app.segment.com//tracking-plans/ to add it `
      )
    }
  })

  // Check that all planned properties meet the provided constraints
  Object.keys(propDescriptors).forEach(k => {
    const { type, pattern, isRequired } = propDescriptors[k]

    if (isRequired && isUndefined(obj[k])) {
      throw new Error(`${k} field is required`)
    }

    if (
      type === 'string' &&
      !isUndefined(obj[k]) &&
      !isString(obj[k])
    ) {
      throw new Error(`${k} should be a string, got ${getType(obj[k])} instead`)
    }

    if (
      type === 'string' &&
      pattern &&
      !isUndefined(obj[k]) &&
      !new RegExp(pattern).test(obj[k])
    ) {
      throw new Error(`${k}'s value of ${obj[k]} doesnt match the regular expression: ${pattern}`)
    }

    if (
      type === 'number' &&
      !isUndefined(obj[k]) &&
      !isNumber(obj[k])
    ) {
      throw new Error(`${k} should be a number, got ${getType(obj[k])} instead`)
    }

    if (
      type === 'boolean' &&
      !isUndefined(obj[k]) &&
      !isBoolean(obj[k])
    ) {
      throw new Error(`${k} should be a boolean, got ${getType(obj[k])} instead`)
    }

    if (
      type === 'array' &&
      !isUndefined(obj[k]) &&
      !isArray(obj[k])
    ) {
      throw new Error(`${k} should be an array, got ${getType(obj[k])} instead`)
    }
  })
}

function getAjsPayload(props: any, propDescriptors: any) {
  const payload = {} as any

  Object.keys(props).forEach(key => {
    payload[propDescriptors[key].field] = props[key]
  })
  return payload
}

interface FeedViewed {
  /**
   * The id of the user this feed belongs to
   */
  profileId: string;
}
/**
 * 
 */
export function feedViewed(props: FeedViewed, context?: any) {
  const propDescriptors = { profileId: { field: 'profile_id', type: 'string', isRequired: true } }
  const payload = getAjsPayload(props, propDescriptors)
  if (process.env.NODE_ENV !== 'production') {
    validateObj(props, propDescriptors)
  }

  if (context) {
    window.analytics.track('Feed Viewed', payload, { context })
  } else {
    window.analytics.track('Feed Viewed', payload)
  }
}

interface PhotoViewed {
  /**
   * The id of the viewed photo
   */
  photoId: string;
}
/**
 * 
 */
export function photoViewed(props: PhotoViewed, context?: any) {
  const propDescriptors = { photoId: { field: 'photo_id', type: 'string', isRequired: true } }
  const payload = getAjsPayload(props, propDescriptors)
  if (process.env.NODE_ENV !== 'production') {
    validateObj(props, propDescriptors)
  }

  if (context) {
    window.analytics.track('Photo Viewed', payload, { context })
  } else {
    window.analytics.track('Photo Viewed', payload)
  }
}

interface ProfileViewed {
  /**
   * The id of the user the profile belongs to
   */
  profileId: string;
}
/**
 * 
 */
export function profileViewed(props: ProfileViewed, context?: any) {
  const propDescriptors = { profileId: { field: 'profile_id', type: 'string', isRequired: true } }
  const payload = getAjsPayload(props, propDescriptors)
  if (process.env.NODE_ENV !== 'production') {
    validateObj(props, propDescriptors)
  }

  if (context) {
    window.analytics.track('Profile Viewed', payload, { context })
  } else {
    window.analytics.track('Profile Viewed', payload)
  }
}

