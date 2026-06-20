// --- Состояние формы ---
let currentStep = 1;
const totalSteps = 3;

// --- Элементы ---
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');

// --- Валидация ---
function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    // Имя — минимум 2 слова
    if (name.value.trim().split(' ').filter(w => w).length < 2) {
      showError('name', 'Введите имя и фамилию');
      name.classList.add('invalid');
      isValid = false;
    } else {
      clearError('name');
      name.classList.remove('invalid');
    }

    // Телефон — минимум 10 цифр
    if (phone.value.replace(/\D/g, '').length < 10) {
      showError('phone', 'Введите корректный номер телефона');
      phone.classList.add('invalid');
      isValid = false;
    } else {
      clearError('phone');
      phone.classList.remove('invalid');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError('email', 'Введите корректный email');
      email.classList.add('invalid');
      isValid = false;
    } else {
      clearError('email');
      email.classList.remove('invalid');
    }
  }

  if (step === 2) {
    const passport = document.getElementById('passport');
    const inn = document.getElementById('inn');
    const address = document.getElementById('address');

    // Паспорт — формат AN 1234567
    const passportRegex = /^[A-Z]{2}\s?\d{7}$/;
    if (!passportRegex.test(passport.value.trim().toUpperCase())) {
      showError('passport', 'Формат: AN 1234567');
      passport.classList.add('invalid');
      isValid = false;
    } else {
      clearError('passport');
      passport.classList.remove('invalid');
    }

    // ИНН — 14 цифр
    if (inn.value.replace(/\D/g, '').length !== 14) {
      showError('inn', 'ИНН должен содержать 14 цифр');
      inn.classList.add('invalid');
      isValid = false;
    } else {
      clearError('inn');
      inn.classList.remove('invalid');
    }

    // Адрес — минимум 5 символов
    if (address.value.trim().length < 5) {
      showError('address', 'Введите адрес проживания');
      address.classList.add('invalid');
      isValid = false;
    } else {
      clearError('address');
      address.classList.remove('invalid');
    }
  }

  if (step === 3) {
    const agree = document.getElementById('agree');
    if (!agree.checked) {
      showError('agree', 'Необходимо принять условия');
      isValid = false;
    } else {
      clearError('agree');
    }
  }

  return isValid;
}

function showError(id, msg) {
  document.getElementById(`error-${id}`).textContent = msg;
}

function clearError(id) {
  document.getElementById(`error-${id}`).textContent = '';
}

// --- Прогресс-бар ---
function updateProgress(step) {
  document.querySelectorAll('.progress-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === step) el.classList.add('active');
    if (s < step) el.classList.add('done');
  });

  document.querySelectorAll('.progress-line').forEach((line, i) => {
    line.classList.toggle('done', i < step - 1);
  });
}

// --- Шаг 3: заполняем данные ---
function fillConfirm() {
  const fields = [
    { key: 'Имя и фамилия',       val: document.getElementById('name').value },
    { key: 'Телефон',              val: document.getElementById('phone').value },
    { key: 'Email',                val: document.getElementById('email').value },
    { key: 'Паспорт',             val: document.getElementById('passport').value },
    { key: 'ИНН',                  val: document.getElementById('inn').value },
    { key: 'Адрес',                val: document.getElementById('address').value },
  ];

  document.getElementById('confirm-list').innerHTML = fields.map(f => `
    <div class="confirm-item">
      <span class="confirm-key">${f.key}</span>
      <span class="confirm-val">${f.val}</span>
    </div>
  `).join('');
}

// --- Навигация ---
function goToStep(step) {
  document.getElementById(`step-${currentStep}`).classList.add('hidden');
  currentStep = step;

  if (currentStep > totalSteps) {
    document.getElementById('step-success').classList.remove('hidden');
    document.getElementById('form-actions').classList.add('hidden');
    updateProgress(totalSteps);
    return;
  }

  document.getElementById(`step-${currentStep}`).classList.remove('hidden');
  updateProgress(currentStep);

  if (currentStep === 3) fillConfirm();

  btnBack.classList.toggle('hidden', currentStep === 1);
  btnNext.textContent = currentStep === totalSteps ? 'Отправить' : 'Далее';
}

// --- События ---
btnNext.addEventListener('click', () => {
  if (validateStep(currentStep)) {
    goToStep(currentStep + 1);
  }
});

btnBack.addEventListener('click', () => {
  goToStep(currentStep - 1);
});

// --- Очищаем ошибку при вводе ---
document.querySelectorAll('.input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
    const errorId = input.id;
    clearError(errorId);
  });
});