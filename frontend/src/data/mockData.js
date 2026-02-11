// mockData.js - Données de démonstration AutoFleet

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
    address: 'Plateau, Dakar',
    email: 'mamadou.diallo@email.com',
    licenseNumber: 'B123456',
    licenseExpiry: '2025-08-15',
    cin: '1234567890123',
    contractId: 1, 
    vehicleId: 'DK-123-AB', 
    status: 'active',
    restDay: 'Lundi'
  },
  { 
    id: 2, 
    name: 'Ibrahima Sarr', 
    photo: '👨🏿‍🦱', 
    phone: '+221 76 234 5678', 
    address: 'Almadies, Dakar',
    email: 'ibrahima.sarr@email.com',
    licenseNumber: 'B234567',
    licenseExpiry: '2025-06-20',
    cin: '2345678901234',
    contractId: 2, 
    vehicleId: 'DK-456-CD', 
    status: 'active',
    restDay: 'Dimanche'
  },
  { 
    id: 3, 
    name: 'Moussa Ndiaye', 
    photo: '👨🏿‍🦲', 
    phone: '+221 78 345 6789', 
    address: 'Médina, Dakar',
    email: 'moussa.ndiaye@email.com',
    licenseNumber: 'B345678',
    licenseExpiry: '2025-03-10',
    cin: '3456789012345',
    contractId: 3, 
    vehicleId: 'DK-789-EF', 
    status: 'active',
    restDay: 'Mardi'
  },
  { 
    id: 4, 
    name: 'Cheikh Ba', 
    photo: '👨🏿', 
    phone: '+221 77 456 7890', 
    address: 'Ouakam, Dakar',
    email: 'cheikh.ba@email.com',
    licenseNumber: 'B456789',
    licenseExpiry: '2026-01-30',
    cin: '4567890123456',
    contractId: 4, 
    vehicleId: 'DK-012-GH', 
    status: 'active',
    restDay: 'Mercredi'
  }
];

export const vehicles = [
  { 
    id: 'DK-123-AB', 
    brand: 'Toyota Corolla', 
    year: 2020, 
    status: 'operational', 
    color: 'Blanc', 
    chassisNumber: 'JT2AE09A0N0123456', 
    mileage: 145000, 
    ownershipType: 'Société', 
    ownerId: null 
  },
  { 
    id: 'DK-456-CD', 
    brand: 'Hyundai Accent', 
    year: 2019, 
    status: 'operational', 
    color: 'Gris', 
    chassisNumber: 'KMHCT41BABZ123456', 
    mileage: 178000, 
    ownershipType: 'Société', 
    ownerId: null 
  },
  { 
    id: 'DK-789-EF', 
    brand: 'Renault Symbol', 
    year: 2021, 
    status: 'operational', 
    color: 'Noir', 
    chassisNumber: 'VF1LB0B0H56123456', 
    mileage: 98000, 
    ownershipType: 'Particulier', 
    ownerId: 1, 
    ownerName: 'Ousmane Fall' 
  },
  { 
    id: 'DK-012-GH', 
    brand: 'Kia Picanto', 
    year: 2022, 
    status: 'operational', 
    color: 'Rouge', 
    chassisNumber: 'KNAPC411CC6123456', 
    mileage: 67000, 
    ownershipType: 'Particulier', 
    ownerId: 2, 
    ownerName: 'Awa Diagne' 
  }
];

export const vehicleOwners = [
  { 
    id: 1, 
    type: 'Particulier',
    firstName: 'Ousmane', 
    lastName: 'Fall',
    cin: '1987654321098',
    phone: '+221 77 555 1234',
    email: 'ousmane.fall@email.com',
    address: 'Mermoz, Dakar',
    bankAccount: 'SN001234567890',
    mobileMoney: '+221 77 555 1234',
    status: 'active'
  },
  { 
    id: 2, 
    type: 'Particulier',
    firstName: 'Awa', 
    lastName: 'Diagne',
    cin: '1876543210987',
    phone: '+221 76 444 5678',
    email: 'awa.diagne@email.com',
    address: 'Point E, Dakar',
    bankAccount: 'SN009876543210',
    mobileMoney: '+221 76 444 5678',
    status: 'active'
  }
];

export const managementContracts = [
  {
    id: 1,
    vehicleId: 'DK-789-EF',
    ownerId: 1,
    ownerName: 'Ousmane Fall',
    driverDailyPayment: 10000,
    ownerDailyShare: 8000,
    companyDailyShare: 2000,
    startDate: '2024-01-01',
    paymentFrequency: 'mensuel',
    paymentDay: 5,
    maintenanceResponsibility: 'société',
    status: 'active'
  },
  {
    id: 2,
    vehicleId: 'DK-012-GH',
    ownerId: 2,
    ownerName: 'Awa Diagne',
    driverDailyPayment: 16000,
    ownerDailyShare: 14000,
    companyDailyShare: 2000,
    startDate: '2024-03-01',
    paymentFrequency: 'mensuel',
    paymentDay: 1,
    maintenanceResponsibility: 'propriétaire',
    status: 'active'
  }
];

export const contracts = [
  { 
    id: 1, 
    driverId: 1, 
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

export const initialPayments = [
  { 
    id: 1, 
    driverId: 1, 
    contractId: 1, 
    date: '2025-02-10', 
    amount: 15000, 
    status: 'paid', 
    time: '18:30', 
    recordedBy: 'Amadou Seck', 
    recordedById: 1,
    recordedAt: '2025-02-10T18:30:00',
    notes: '',
    modifications: [] 
  },
  { 
    id: 2, 
    driverId: 1, 
    contractId: 1, 
    date: '2025-02-09', 
    amount: 15000, 
    status: 'paid', 
    time: '19:15', 
    recordedBy: 'Amadou Seck', 
    recordedById: 1,
    recordedAt: '2025-02-09T19:15:00',
    notes: '',
    modifications: [] 
  },
  { 
    id: 3, 
    driverId: 2, 
    contractId: 2, 
    date: '2025-02-10', 
    amount: 12000, 
    status: 'paid', 
    time: '17:45', 
    recordedBy: 'Fatou Diop', 
    recordedById: 2,
    recordedAt: '2025-02-10T17:45:00',
    notes: '',
    modifications: [] 
  },
  { 
    id: 4, 
    driverId: 3, 
    contractId: 3, 
    date: '2025-02-10', 
    amount: 10000, 
    status: 'paid', 
    time: '19:00', 
    recordedBy: 'Fatou Diop', 
    recordedById: 2,
    recordedAt: '2025-02-10T19:00:00',
    notes: '',
    modifications: [] 
  },
  { 
    id: 5, 
    driverId: 4, 
    contractId: 4, 
    date: '2025-02-10', 
    amount: 16000, 
    status: 'paid', 
    time: '18:00', 
    recordedBy: 'Moustapha Kane', 
    recordedById: 3,
    recordedAt: '2025-02-10T18:00:00',
    notes: '',
    modifications: [] 
  }
];
