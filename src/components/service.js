export const convertKilometersToMiles = (distance) => {
  const milesPerKilometer = 0.621371
  const totalMiles = milesPerKilometer * distance
  const roundedMiles = totalMiles.toFixed(2)

  return roundedMiles
}

export const convertMilesToKilometers = (distance) => {
  const kilometersPerMile = 1.60934
  return kilometersPerMile * distance
}

export const convertStepsPerMileToStepsPerKm = (stepsPerMile) => {
  return parseInt(stepsPerMile / 1.60934);
}


// Formula Source: https://journals.lww.com/acsm-healthfitness/Fulltext/2008/01000/ONE_MILE_STEP_COUNT_AT_WALKING_AND_RUNNING_SPEEDS.7.aspx
export const stepsPerMileRunning = (feet, inches, pace) => {
  const height = feet * 12 + inches
  const heightMultiplier = 13.5 * height
  const paceMultiplier = 143.6 * pace
  const stepConstant = 1084
  const stepsPerMile = stepConstant + (paceMultiplier - heightMultiplier)
  const roundedStepsPerMile = parseInt(stepsPerMile, 10)

  return roundedStepsPerMile
}

export const stepsPerMileWalking = (feet, inches, pace, gender) => {
  const height = feet * 12 + inches
  const heightMultiplier = 14.1 * height
  const paceMultiplier = 63.4 * pace
  let stepConstant = gender === 'Female' ? 1949 : 1916;
  const stepsPerMile = stepConstant + (paceMultiplier - heightMultiplier)
  const roundedStepsPerMile = parseInt(stepsPerMile, 10)

  return roundedStepsPerMile
}
