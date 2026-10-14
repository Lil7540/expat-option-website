const state = {
  user: {
    name: 'Investor',
    isLoggedIn: false,
  },
  balance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  referralBonus: 0,
  transactions: [
    { type: 'Welcome Bonus', amount: 0, status: 'success', date: 'Today' },
  ],
};

const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeName = document.getElementById('welcomeName');
const balanceValue = document.getElementById('balanceValue');
const depositsValue = document.getElementById('depositsValue');
const withdrawalsValue = document.getElementById('withdrawalsValue');
const referralValue = document.getElementById('referralValue');
const transactionTableBody = document.getElementById('transactionTableBody');
const depositForm = document.getElementById('depositForm');
const withdrawForm = document.getElementById('withdrawForm');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function renderDashboard() {
  welcomeName.textContent = state.user.name;
  balanceValue.textContent = formatCurrency(state.balance);
  depositsValue.textContent = formatCurrency(state.totalDeposits);
  withdrawalsValue.textContent = formatCurrency(state.totalWithdrawals);
  referralValue.textContent = formatCurrency(state.referralBonus);

  transactionTableBody.innerHTML = state.transactions
    .slice()
    .reverse()
    .map((tx) => {
      const statusClass = tx.status === 'success' ? 'success' : 'pending';
      return `
        <tr>
          <td>${tx.type}</td>
          <td>${formatCurrency(tx.amount)}</td>
          <td><span class="status-pill ${statusClass}">${tx.status}</span></td>
          <td>${tx.date}</td>
        </tr>
      `;
    })
    .join('');
}

loginBtn.addEventListener('click', () => {
  document.getElementById('authCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('fullName').value.trim() || 'Investor';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) return;

  state.user.name = name;
  state.user.isLoggedIn = true;
  document.getElementById('authCard').classList.add('hidden');
  document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderDashboard();
});

logoutBtn.addEventListener('click', () => {
  state.user.isLoggedIn = false;
  state.user.name = 'Investor';
  document.getElementById('authCard').classList.remove('hidden');
  document.getElementById('authCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  renderDashboard();
});

depositForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(document.getElementById('depositAmount').value || 0);
  const plan = document.getElementById('depositPlan').value;

  if (amount <= 0) return;

  state.balance += amount;
  state.totalDeposits += amount;
  state.referralBonus += amount * 0.15;
  state.transactions.push({
    type: `Deposit - ${plan}`,
    amount,
    status: 'success',
    date: new Date().toLocaleDateString(),
  });

  renderDashboard();
});

withdrawForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(document.getElementById('withdrawAmount').value || 0);
  const method = document.getElementById('withdrawMethod').value;

  if (amount <= 0) return;
  if (amount > state.balance) {
    alert('Insufficient balance for withdrawal.');
    return;
  }

  state.balance -= amount;
  state.totalWithdrawals += amount;
  state.transactions.push({
    type: `Withdrawal - ${method}`,
    amount,
    status: 'pending',
    date: new Date().toLocaleDateString(),
  });

  renderDashboard();
});

renderDashboard();
