// UI функции
let currentMonth = Storage.getCurrentMonth();
let currentFilter = 'all';
let currentSort = 'date-desc';

// Показать toast сообщение
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Переключить экран
function switchScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${screenName}`).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  if (screenName === 'expenses') renderExpensesList();
  if (screenName === 'plan') renderBudgetList();
}

// Следующий/предыдущий месяц
function nextMonth() {
  const [year, month] = currentMonth.split('-').map(Number);
  const nextDate = new Date(year, month, 1);
  currentMonth = nextDate.toISOString().slice(0, 7);
  Storage.setCurrentMonth(currentMonth);
  updateUI();
}

function prevMonth() {
  const [year, month] = currentMonth.split('-').map(Number);
  const prevDate = new Date(year, month - 2, 1);
  currentMonth = prevDate.toISOString().slice(0, 7);
  Storage.setCurrentMonth(currentMonth);
  updateUI();
}

function updateUI() {
  updateMonthDisplay();
  renderHomeScreen();
  renderExpensesList();
  renderBudgetList();
}

function updateMonthDisplay() {
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const [year, month] = currentMonth.split('-');
  const displayText = `${monthNames[parseInt(month) - 1]} ${year}`;
  document.querySelectorAll('[id^="currentMonthName"]').forEach(el => {
    el.textContent = displayText;
  });
}

function renderHomeScreen() {
  const transactions = Storage.getTransactions().filter(t => t.date.startsWith(currentMonth));
  const incomes = Storage.getIncomes().filter(i => i.date.startsWith(currentMonth));
  
  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
  const totalExpense = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const balance = totalIncome - totalExpense;
  
  document.getElementById('totalIncome').textContent = `${totalIncome.toFixed(0)} ₽`;
  document.getElementById('totalExpense').textContent = `${totalExpense.toFixed(0)} ₽`;
  document.getElementById('totalBalance').textContent = `${balance.toFixed(0)} ₽`;
  
  const recentList = document.getElementById('recentList');
  const recent = transactions.slice(-5).reverse();
  recentList.innerHTML = recent.map(t => `
    <div class="transaction-item" onclick="editTransaction(${t.id})">
      <div class="transaction-info">
        <div class="transaction-name">${t.name}</div>
        <div class="transaction-date">${t.date}</div>
      </div>
      <div class="transaction-amount">${t.amount} ₽</div>
    </div>
  `).join('') || '<p>Нет транзакций</p>';
}

function renderExpensesList() {
  const expensesList = document.getElementById('expensesList');
  if (!expensesList) return;
  
  let transactions = Storage.getTransactions()
    .filter(t => t.date.startsWith(currentMonth));
  
  if (currentFilter !== 'all') {
    transactions = transactions.filter(t => t.category === currentFilter);
  }
  
  transactions.sort((a, b) => {
    if (currentSort === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (currentSort === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (currentSort === 'amount-desc') return b.amount - a.amount;
    if (currentSort === 'amount-asc') return a.amount - b.amount;
  });
  
  expensesList.innerHTML = transactions.map(t => `
    <div class="transaction-item" onclick="editTransaction(${t.id})">
      <div class="transaction-info">
        <div class="transaction-name">${t.name}</div>
        <div class="transaction-date">${t.date}</div>
      </div>
      <div class="transaction-amount">${t.amount} ₽</div>
    </div>
  `).join('') || '<p>Нет транзакций</p>';
}

function renderBudgetList() {
  const budgetList = document.getElementById('budgetList');
  if (!budgetList) return;
  
  const limits = Storage.getLimits();
  const transactions = Storage.getTransactions()
    .filter(t => t.date.startsWith(currentMonth));
  
  budgetList.innerHTML = CONFIG.EXPENSE_CATEGORIES.map(cat => {
    const spent = transactions
      .filter(t => t.category === cat.id)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const limit = limits[cat.id] || 0;
    const percent = limit > 0 ? (spent / limit) * 100 : 0;
    
    return `
      <div class="budget-item">
        <div class="budget-info">
          <div class="budget-name">${cat.name}</div>
          <div class="budget-progress">${spent.toFixed(0)} / ${limit} ₽</div>
          <div class="progress-bar">
            <div class="progress-fill ${percent > 90 ? 'danger' : percent > 70 ? 'warning' : ''}" 
                 style="width: ${Math.min(percent, 100)}%"></div>
          </div>
        </div>
        <button class="btn-primary" onclick="editLimit('${cat.id}')">✏️</button>
      </div>
    `;
  }).join('');
}

function filterByCategory(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderExpensesList();
}

function openAddModal(type) {
  document.getElementById('modalOverlay').classList.add('active');
  if (type === 'expense') {
    document.getElementById('transactionModal').style.display = 'block';
    document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
  } else if (type === 'income') {
    document.getElementById('incomeModal').style.display = 'block';
    document.getElementById('incDate').value = new Date().toISOString().split('T')[0];
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function saveTransaction() {
  const transaction = {
    name: document.getElementById('txName').value,
    amount: parseFloat(document.getElementById('txAmount').value),
    category: document.getElementById('txCategory').value,
    date: document.getElementById('txDate').value
  };
  
  if (transaction.name && transaction.amount && transaction.category && transaction.date) {
    Storage.addTransaction(transaction);
    showToast('Расход добавлен');
    closeModal();
    updateUI();
  }
}

function clearCache() {
  if (confirm('Очистить все данные?')) {
    Storage.clearAll();
    showToast('Данные очищены');
    location.reload();
  }
}

function manualSync() {
  SheetsSync.sync();
}
