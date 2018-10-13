/**
 *  This client was generated from a Tracking Plan schema; ** Do Not Edit **
 *
 *  Tracking Plan: 
 */

function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
};

function isArray(val) {
  return getType(val) === 'Array'
}

function isNumber(val) {
  return getType(val) === 'Number'
}

function isString(val) {
  return getType(val) === 'String'
}

function isObject(val) {
  return getType(val) === 'Object'
}

function isBoolean(val) {
  return getType(val) === 'Boolean'
}

function isUndefined(val) {
  return getType(val) === 'Undefined'
}

function validateObj(obj, propDescriptors) {
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

function getAjsPayload(props, propDescriptors) {
  const payload = {}

  Object.keys(props).forEach(key => {
    payload[propDescriptors[key].field] = props[key]
  })
  return payload
}

/**
* @typedef {Object} FeedViewedProperty - param object
* @property { string } profileId - The id of the user this feed belongs to
*/

/**
* 
* @param  { FeedViewedProperty } props
* @param {Object=} context - An optional object containing context properties https://segment.com/docs/spec/common/#context
*/
export function feedViewed(props, context) {
  const propDescriptors = { profileId: { field: 'profile_id', type: 'string', pattern: undefined, isRequired: true } }
  if (process.env.NODE_ENV !== 'production') {
    validateObj(props, propDescriptors)
  }
  const payload = getAjsPayload(props, propDescriptors)

  if (context) {
    window.analytics.track('Feed Viewed', payload, { context })
  } else {
    window.analytics.track('Feed Viewed', payload)
  }
}

/**
* @typedef {Object} PhotoViewedProperty - param object
* @property { string } photoId - The id of the viewed photo
*/

/**
* 
* @param  { PhotoViewedProperty } props
* @param {Object=} context - An optional object containing context properties https://segment.com/docs/spec/common/#context
*/
export function photoViewed(props, context) {
  const propDescriptors = { photoId: { field: 'photo_id', type: 'string', pattern: undefined, isRequired: true } }
  if (process.env.NODE_ENV !== 'production') {
    validateObj(props, propDescriptors)
  }
  const payload = getAjsPayload(props, propDescriptors)

  if (context) {
    window.analytics.track('Photo Viewed', payload, { context })
  } else {
    window.analytics.track('Photo Viewed', payload)
  }
}

/**
* @typedef {Object} ProfileViewedProperty - param object
* @property { string } profileId - The id of the user the profile belongs to
*/

/**
* 
* @param  { ProfileViewedProperty } props
* @param {Object=} context - An optional object containing context properties https://segment.com/docs/spec/common/#context
*/
export function profileViewed(props, context) {
  const propDescriptors = { profileId: { field: 'profile_id', type: 'string', pattern: undefined, isRequired: true } }
  if (process.env.NODE_ENV !== 'production') {
    validateObj(props, propDescriptors)
  }
  const payload = getAjsPayload(props, propDescriptors)

  if (context) {
    window.analytics.track('Profile Viewed', payload, { context })
  } else {
    window.analytics.track('Profile Viewed', payload)
  }
}

