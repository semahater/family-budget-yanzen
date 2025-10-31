// Синхронизация с Google Sheets
const SheetsSync = {
  isOnline: false,
  syncInProgress: false,

  // Проверить подключение
  checkConnection() {
    this.isOnline = navigator.onLine;
    this.updateSyncStatus();
    return this.isOnline;
  },

  // Обновить статус синхронизации
  updateSyncStatus() {
    const statusElements = [
      document.getElementById('syncStatus'),
      document.getElementById('syncStatus2'),
      document.getElementById('syncStatus3')
    ];

    statusElements.forEach(el => {
      if (el) {
        if (this.syncInProgress) {
          el.textContent = '🔄 Синхронизация...';
        } else if (this.isOnline) {
          el.textContent = '✅ Онлайн';
        } else {
          el.textContent = '❌ Оффлайн';
        }
      }
    });

    const syncStatusText = document.getElementById('syncStatusText');
    if (syncStatusText) {
      syncStatusText.textContent = `Статус: ${this.isOnline ? '✅ Онлайн' : '❌ Оффлайн'}`;
    }
  },

  // Синхронизировать данные
  async sync() {
    if (!this.checkConnection()) {
      showToast('Нет интернет-соединения');
      return false;
    }

    if (this.syncInProgress) {
      showToast('Синхронизация уже выполняется');
      return false;
    }

    this.syncInProgress = true;
    this.updateSyncStatus();

    try {
      // TODO: Реализовать интеграцию с Google Sheets API
      // Пока это заглушка
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Обновить время последней синхронизации
      const timestamp = new Date().toLocaleString('ru-RU');
      Storage.setLastSync(timestamp);

      const lastSyncTime = document.getElementById('lastSyncTime');
      if (lastSyncTime) {
        lastSyncTime.textContent = `Последняя синхр: ${timestamp}`;
      }

      showToast('Синхронизация завершена');
      return true;
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
      showToast('Ошибка синхронизации');
      return false;
    } finally {
      this.syncInProgress = false;
      this.updateSyncStatus();
    }
  },

  // Автоматическая синхронизация
  startAutoSync() {
    setInterval(() => {
      if (this.checkConnection()) {
        this.sync();
      }
    }, CONFIG.APP.syncInterval);
  },

  // Инициализация
  init() {
    this.checkConnection();

    // Отслеживать изменения статуса сети
    window.addEventListener('online', () => {
      this.checkConnection();
      showToast('Подключение восстановлено');
    });

    window.addEventListener('offline', () => {
      this.checkConnection();
      showToast('Нет подключения к интернету');
    });

    // Показать время последней синхронизации
    const lastSync = Storage.getLastSync();
    const lastSyncTime = document.getElementById('lastSyncTime');
    if (lastSyncTime && lastSync) {
      lastSyncTime.textContent = `Последняя синхр: ${lastSync}`;
    }

    // Запустить автоматическую синхронизацию
    this.startAutoSync();
  }
};
