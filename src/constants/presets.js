export const PRESETS = [
  {
    id: 'vitamin-e',
    name: 'Vitamin E (Alpha-Tocopherol)',
    doseTaken: 180,
    dailyNeed: 15,
    unit: 'mg',
    routine: 'before_bed',
    routineTime: '22:00',
    icon: '💊',
    description: 'Fat-soluble vitamin stored in body tissues. 180 mg covers ~12 days at 15 mg/day RDA.'
  },
  {
    id: 'vitamin-d-60k',
    name: 'Vitamin D3 (Cholecalciferol Mega-dose)',
    doseTaken: 60000,
    dailyNeed: 1000,
    unit: 'IU',
    routine: 'after_food',
    routineTime: '20:30',
    icon: '☀️',
    description: 'Weekly/monthly replenishment depot. Absorbed best with fat-containing meals.'
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12 (Methylcobalamin)',
    doseTaken: 1000,
    dailyNeed: 2.4,
    unit: 'mcg',
    routine: 'before_breakfast',
    routineTime: '08:00',
    icon: '💧',
    description: 'Water-soluble; surplus stored in the liver. Depot weekly/monthly dose.'
  },
  {
    id: 'iron-depot',
    name: 'Elemental Iron (Ferrous Fumarate)',
    doseTaken: 100,
    dailyNeed: 14,
    unit: 'mg',
    routine: 'before_breakfast',
    routineTime: '08:00',
    icon: '🩸',
    description: 'Take on empty stomach or with Vitamin C for optimal absorption.'
  },
  {
    id: 'magnesium',
    name: 'Magnesium Glycinate',
    doseTaken: 400,
    dailyNeed: 400,
    unit: 'mg',
    routine: 'before_bed',
    routineTime: '22:00',
    icon: '🌙',
    description: 'Daily relaxing nervous-system mineral, best taken 30-60 min before sleep.'
  }
];

export const ROUTINES = {
  before_bed: {
    id: 'before_bed',
    label: 'Before Bed',
    time: '22:00',
    timeLabel: '10:00 PM',
    icon: '🌙'
  },
  after_food: {
    id: 'after_food',
    label: 'After Dinner',
    time: '20:30',
    timeLabel: '08:30 PM',
    icon: '🍽️'
  },
  with_lunch: {
    id: 'with_lunch',
    label: 'With Lunch',
    time: '13:00',
    timeLabel: '01:00 PM',
    icon: '🥗'
  },
  before_breakfast: {
    id: 'before_breakfast',
    label: 'Before Breakfast',
    time: '08:00',
    timeLabel: '08:00 AM',
    icon: '☀️'
  }
};
