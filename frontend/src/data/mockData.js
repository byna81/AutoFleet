export const drivers = [
  { id: 1, name: 'Mamadou Diallo', phone: '+221 77 123 4567', contractId: 1, vehicleId: 'DK-123-AB' },
  { id: 2, name: 'Ibrahima Sarr', phone: '+221 76 234 5678', contractId: 2, vehicleId: 'DK-456-CD' },
  { id: 3, name: 'Moussa Ndiaye', phone: '+221 78 345 6789', contractId: 3, vehicleId: 'DK-789-EF' },
  { id: 4, name: 'Cheikh Ba', phone: '+221 77 456 7890', contractId: 4, vehicleId: 'DK-012-GH' }
];

export const vehicles = [
  { id: 'DK-123-AB', brand: 'Toyota Corolla', year: 2020, ownershipType: 'Société' },
  { id: 'DK-456-CD', brand: 'Hyundai Accent', year: 2019, ownershipType: 'Société' },
  { id: 'DK-789-EF', brand: 'Renault Symbol', year: 2021, ownershipType: 'Particulier', ownerName: 'Ousmane Fall' },
  { id: 'DK-012-GH', brand: 'Kia Picanto', year: 2022, ownershipType: 'Particulier', ownerName: 'Awa Diagne' }
];

export const contracts = [
  { id: 1, driverId: 1, vehicleId: 'DK-123-AB', type: 'LAO', dailyAmount: 15000 },
  { id: 2, driverId: 2, vehicleId: 'DK-456-CD', type: 'Location', dailyAmount: 12000 },
  { id: 3, driverId: 3, vehicleId: 'DK-789-EF', type: 'Location', dailyAmount: 10000 },
  { id: 4, driverId: 4, vehicleId: 'DK-012-GH', type: 'LAO', dailyAmount: 16000 }
];

export const managementContracts = [
  { id: 1, vehicleId: 'DK-789-EF', ownerName: 'Ousmane Fall', driverDailyPayment: 10000, ownerDailyShare: 8000, companyDailyShare: 2000 },
  { id: 2, vehicleId: 'DK-012-GH', ownerName: 'Awa Diagne', driverDailyPayment: 16000, ownerDailyShare: 14000, companyDailyShare: 2000 }
];
