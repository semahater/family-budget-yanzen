// Управление локальным хранилищем
const Storage = {
  // Получить данные
  getData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Ошибка чтения данных:', e);
      return null;
    }
  },

  // Сохранить данные
  setData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Ошибка сохранения данных:', e);
      return false;
    }
  },

  // Удалить данные
  removeData(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Ошибка удаления данных:', e);
      return false;
    }
  },

  // Очистить все данные
  clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Ошибка очистки данных:', e);
      return false;
    }
  },

  // Получить все транзакции
  getTransactions() {
    return this.getData('transactions') || [];
  },

  // Сохранить транзакции
  setTransactions(transactions) {
    return this.setData('transactions', transactions);
  },

  // Добавить транзакцию
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    transaction.id = Date.now();
    transactions.push(transaction);
    return this.setTransactions(transactions);
  },

  // Удалить транзакцию
  deleteTransaction(id) {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    return this.setTransactions(filtered);
  },

  // Получить доходы
  getIncomes() {
    return this.getData('incomes') || [];
  },

  // Сохранить доходы
  setIncomes(incomes) {
    return this.setData('incomes', incomes);
  },

  // Добавить доход
  addIncome(income) {
    const incomes = this.getIncomes();
    income.id = Date.now();
    incomes.push(income);
    return this.setIncomes(incomes);
  },

  // Получить лимиты
  getLimits() {
    return this.getData('limits') || CONFIG.DEFAULT_LIMITS;
  },

  // Сохранить лимиты
  setLimits(limits) {
    return this.setData('limits', limits);
  },

  // Получить текущий месяц
  getCurrentMonth() {
    return this.getData('currentMonth') || new Date().toISOString().slice(0, 7);
  },

  // Установить текущий месяц
  setCurrentMonth(month) {
    return this.setData('currentMonth', month);
  },

  // Получить последнюю синхронизацию
  getLastSync() {
    return this.getData('lastSync') || null;
  },

  // Установить последнюю синхронизацию
  setLastSync(timestamp) {
    return this.setData('lastSync', timestamp);
  }
};
