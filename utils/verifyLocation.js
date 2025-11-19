export const isWithinAllowedLocation = (lat, lng) => {
  const officeLat = parseFloat(process.env.OFFICE_LAT);
  const officeLng = parseFloat(process.env.OFFICE_LNG);
  const radius = parseFloat(process.env.ALLOWED_RADIUS_METERS);

  const R = 6371e3; // meters
  const φ1 = (officeLat * Math.PI) / 180;
  const φ2 = (lat * Math.PI) / 180;
  const Δφ = ((lat - officeLat) * Math.PI) / 180;
  const Δλ = ((lng - officeLng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // meters
  return distance <= radius;
};
