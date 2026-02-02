const emissionFactors = {
  car: 0.12,
  flight: 0.255,
  electricity: 0.5,
  beef: 6.0,
  vegetarian: 1.5
};

const calculateCarbon = (activityType, value) => {
  const factor = emissionFactors[activityType];
  if (!factor) {
    throw new Error("Invalid activity type");
  }
  return value * factor;
};

module.exports = calculateCarbon;
