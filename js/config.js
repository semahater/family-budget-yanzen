// Конфигурация приложения
const CONFIG = {
  // Google Sheets API конфигурация
  SHEET_ID: 'YOUR_SHEET_ID_HERE',
  API_KEY: 'YOUR_API_KEY_HERE',
  
  // Категории расходов
  EXPENSE_CATEGORIES: [
    { id: 'food', name: '🍔 Продукты', color: '#E74C3C' },
    { id: 'transport', name: '🚗 Транспорт', color: '#3498DB' },
    { id: 'home', name: '🏠 Дом', color: '#9B59B6' },
    { id: 'health', name: '💊 Здоровье', color: '#1ABC9C' },
    { id: 'entertainment', name: '🎬 Развлечения', color: '#F39C12' },
    { id: 'education', name: '📚 Образование', color: '#27AE60' },
    { id: 'clothes', name: '👕 Одежда', color: '#E67E22' },
    { id: 'other', name: '💰 Прочее', color: '#95A5A6' }
  ],
  
  // Лимиты по умолчанию (в рублях)
  DEFAULT_LIMITS: {
    food: 30000,
    transport: 10000,
    home: 20000,
    health: 5000,
    entertainment: 10000,
    education: 5000,
    clothes: 5000,
    other: 5000
  },
  
  // Профили
  PROFILES: [
    { id: 'semen', name: 'Семён', emoji: '👨' },
    { id: 'tatyana', name: 'Татьяна', emoji: '👩' }
  ],
  
  // Настройки приложения
  APP: {
    version: '2.1',
    name: 'Семейный бюджет Янцен',
    syncInterval: 300000 // 5 минут в миллисекундах
  }
};
