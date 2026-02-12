// mockData.js - Données complètes AutoFleet v2 (EXPORTS CORRIGÉS)

export const users = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin123', 
    name: 'Amadou Seck',
    role: 'Administrateur',
    email: 'admin@autofleet.sn',
    phone: '+221 77 999 8888',
    avatar: '👨🏿‍💼',
    permissions: ['all']
  },
  { 
    id: 2, 
    username: 'fatou', 
    password: 'gestion123', 
    name: 'Fatou Diop',
    role: 'Gestionnaire',
    email: 'fatou.diop@autofleet.sn',
    phone: '+221 76 888 7777',
    avatar: '👩🏿‍💼',
    permissions: ['drivers', 'contracts', 'payments', 'vehicles', 'maintenance', 'alerts']
  }
];

export const drivers = [
  { 
    id: 1, 
    name: 'Mamadou Diallo', 
    photo: '👨🏿',
    phone: '+221 77 123 4567',
    email: 'mamadou.diallo@email.com',
    address: 'Plateau, Dakar',
    licenseNumber: 'B123456',
    licenseExpiry: '2025-08-15',
    cin: '1234567890123',
    contractId: 1,
    vehicleId: 'DK-123-AB',
    restDay: 'Lundi',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Ibrahima Sarr',
    photo: '👨🏿‍🦱',
    phone: '+221 76 234 5678',
    email: 'ibrahima.sarr@email.com',
    address: 'Almadies, Dakar',
    licenseNumber: 'B234567',
    licenseExpiry: '2025-06-20',
    cin: '2345678901234',
    contractId: 2,
    vehicleId: 'DK-456-CD',
    restDay: 'Dimanche',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Moussa Ndiaye',
    photo: '👨🏿‍🦲',
    phone: '+221 78 345 6789',
    email: 'moussa.ndiaye@email.com',
    address: 'Médina, Dakar',
    licenseNumber: 'B345678',
    licenseExpiry: '2025-03-10',
    cin: '3456789012345',
    contractId: 3,
    vehicleId: 'DK-789-EF',
    restDay: 'Mardi',
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Cheikh Ba',
    photo: '👨🏿',
    phone: '+221 77 456 7890',
    email: 'cheikh.ba@email.com',
    address: 'Ouakam, Dakar',
    licenseNumber: 'B456789',
    licenseExpiry: '2026-01-30',
    cin: '4567890123456',
    contractId: 4,
    vehicleId: 'DK-012-GH',
    restDay: 'Mercredi',
    status: 'active'
  }
];

export const vehicles = [
  { 
    id: 'DK-123-AB', 
    brand: 'Toyota Corolla', 
    year: 2020,
    color: 'Blanc',
    chassisNumber: 'JT2AE09A0N0123456',
    mileage: 145000,
    ownershipType: 'Société',
    driverId: 1,
    driverName: 'Mamadou Diallo',
    status: 'validated'
  },
  { 
    id: 'DK-456-CD', 
    brand: 'Hyundai Accent', 
    year: 2019,
    color: 'Gris',
    chassisNumber: 'KMHCT41BABZ123456',
    mileage: 178000,
    ownershipType: 'Société',
    driverId: 2,
    driverName: 'Ibrahima Sarr',
    status: 'validated'
  },
  { 
    id: 'DK-789-EF', 
    brand: 'Renault Symbol', 
    year: 2021,
    color: 'Noir',
    chassisNumber: 'VF1LB0B0H56123456',
    mileage: 98000,
    ownershipType: 'Particulier',
    ownerName: 'Ousmane Fall',
    driverId: 3,
    driverName: 'Moussa Ndiaye',
    status: 'validated'
  },
  { 
    id: 'DK-012-GH', 
    brand: 'Kia Picanto', 
    year: 2022,
    color: 'Rouge',
    chassisNumber: 'KNAPC411CC6123456',
    mileage: 67000,
    ownershipType: 'Particulier',
    ownerName: 'Awa Diagne',
    driverId: 4,
    driverName: 'Cheikh Ba',
    status: 'validated'
  }
];

export const contracts = [
  { 
    id: 1, 
    driverId: 1,
    driverName: 'Mamadou Diallo',
    vehicleId: 'DK-123-AB',
    type: 'LAO',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    dailyAmount: 15000,
    deposit: 500000,
    totalAmount: 10950000,
    restDay: 'Lundi',
    status: 'active'
  },
  { 
    id: 2, 
    driverId: 2,
    driverName: 'Ibrahima Sarr',
    vehicleId: 'DK-456-CD',
    type: 'Location',
    startDate: '2024-02-20',
    endDate: '2025-02-20',
    dailyAmount: 12000,
    deposit: 300000,
    totalAmount: 4380000,
    restDay: 'Dimanche',
    status: 'active'
  },
  { 
    id: 3, 
    driverId: 3,
    driverName: 'Moussa Ndiaye',
    vehicleId: 'DK-789-EF',
    type: 'Location',
    startDate: '2023-11-10',
    endDate: '2024-11-10',
    dailyAmount: 10000,
    deposit: 250000,
    totalAmount: 3650000,
    restDay: 'Mardi',
    status: 'active'
  },
  { 
    id: 4, 
    driverId: 4,
    driverName: 'Cheikh Ba',
    vehicleId: 'DK-012-GH',
    type: 'LAO',
    startDate: '2024-03-05',
    endDate: '2026-03-05',
    dailyAmount: 16000,
    deposit: 600000,
    totalAmount: 11680000,
    restDay: 'Mercredi',
    status: 'active'
  }
];

export const managementContracts = [
  { 
    id: 1, 
    vehicleId: 'DK-789-EF', 
    ownerName: 'Ousmane Fall', 
    driverDailyPayment: 10000, 
    ownerDailyShare: 8000, 
    companyDailyShare: 2000,
    startDate: '2024-01-01',
    status: 'validated',
    createdBy: 2,
    createdByName: 'Fatou Diop',
    createdAt: '2024-01-01T10:00:00',
    validatedBy: 1,
    validatedByName: 'Amadou Seck',
    validatedAt: '2024-01-01T14:00:00'
  },
  { 
    id: 2, 
    vehicleId: 'DK-012-GH', 
    ownerName: 'Awa Diagne', 
    driverDailyPayment: 16000, 
    ownerDailyShare: 14000, 
    companyDailyShare: 2000,
    startDate: '2024-03-01',
    status: 'validated',
    createdBy: 2,
    createdByName: 'Fatou Diop',
    createdAt: '2024-03-01T10:00:00',
    validatedBy: 1,
    validatedByName: 'Amadou Seck',
    validatedAt: '2024-03-01T14:00:00'
  }
];

export const initialPayments = [
  { id: 1, driverId: 1, contractId: 1, date: '2025-02-10', amount: 15000, status: 'paid', time: '18:30', recordedBy: 'Amadou Seck', recordedById: 1, recordedAt: '2025-02-10T18:30:00', modifications: [] },
  { id: 2, driverId: 1, contractId: 1, date: '2025-02-09', amount: 15000, status: 'paid', time: '19:15', recordedBy: 'Amadou Seck', recordedById: 1, recordedAt: '2025-02-09T19:15:00', modifications: [] },
  { id: 3, driverId: 2, contractId: 2, date: '2025-02-10', amount: 12000, status: 'paid', time: '17:45', recordedBy: 'Fatou Diop', recordedById: 2, recordedAt: '2025-02-10T17:45:00', modifications: [] },
  { id: 4, driverId: 3, contractId: 3, date: '2025-02-10', amount: 10000, status: 'paid', time: '19:00', recordedBy: 'Fatou Diop', recordedById: 2, recordedAt: '2025-02-10T19:00:00', modifications: [] },
  { id: 5, driverId: 4, contractId: 4, date: '2025-02-10', amount: 16000, status: 'paid', time: '18:00', recordedBy: 'Fatou Diop', recordedById: 2, recordedAt: '2025-02-10T18:00:00', modifications: [] }
];

export const maintenanceSchedule = [
  {
    id: 1,
    vehicleId: 'DK-123-AB',
    vehicleName: 'Toyota Corolla',
    type: 'Vidange',
    currentMileage: 145000,
    nextMileage: 150000,
    dueDate: '2025-03-15',
    status: 'pending',
    estimatedCost: 35000,
    notes: 'Vidange moteur + filtre à huile'
  },
  {
    id: 2,
    vehicleId: 'DK-456-CD',
    vehicleName: 'Hyundai Accent',
    type: 'Révision',
    currentMileage: 178000,
    nextMileage: 180000,
    dueDate: '2025-02-20',
    status: 'urgent',
    estimatedCost: 75000,
    notes: 'Révision générale + freins'
  }
];

export const initialOwnerPayments = [];
