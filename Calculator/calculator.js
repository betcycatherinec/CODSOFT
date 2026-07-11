/* ---------- Grab elements ---------- */
const previousOperandEl = document.getElementById('previousOperand');
const currentOperandEl  = document.getElementById('currentOperand');
const allButtons        = document.querySelectorAll('button');

/* ---------- Calculator state ---------- */
let currentOperand  = '0';   // what's currently being typed
let previousOperand = '';    // the stored first number
let operator        = null;  // the chosen operator (+, -, ×, ÷, %)
let resetNext        = false; // true right after "=" so next digit starts fresh

/* ---------- Update the screen ---------- */
function updateDisplay(){
  currentOperandEl.textContent = currentOperand;
  previousOperandEl.textContent = previousOperand
    ? `${previousOperand} ${operator}`
    : '';
}

/* ---------- Append a digit ---------- */
function appendNumber(digit){
  if (currentOperand === '0' || resetNext){
    currentOperand = digit;
    resetNext = false;
  } else {
    currentOperand += digit;
  }
}

/* ---------- Append a decimal point ---------- */
function appendDecimal(){
  if (resetNext){
    currentOperand = '0.';
    resetNext = false;
    return;
  }
  // if-else used here to avoid adding a second "."
  if (!currentOperand.includes('.')){
    currentOperand += '.';
  }
}

/* ---------- Choose an operator ---------- */
function chooseOperator(op){
  if (currentOperand === '' ) return;

  if (previousOperand !== ''){
    // an operator was already chosen once before -> calculate first
    compute();
  }

  operator = op;
  previousOperand = currentOperand;
  resetNext = true;
}

/* ---------- Perform the calculation ---------- */
function compute(){
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return;

  let result = 0;

  // if-else chain covering every supported operator
  if (operator === '+'){
    result = prev + curr;
  } else if (operator === '-'){
    result = prev - curr;
  } else if (operator === '×'){
    result = prev * curr;
  } else if (operator === '÷'){
    result = curr === 0 ? 'Error' : prev / curr;
  } else if (operator === '%'){
    result = prev % curr;
  } else {
    return;
  }

  // round off small floating point errors, unless it's an error string
  currentOperand = (result === 'Error') ? 'Error' : roundResult(result);
  operator = null;
  previousOperand = '';
  resetNext = true;
}

/* ---------- Round long decimals down to 8 places ---------- */
function roundResult(number){
  let rounded = Math.round(number * 1e8) / 1e8;
  return rounded.toString();
}

/* ---------- Clear everything ---------- */
function clearAll(){
  currentOperand  = '0';
  previousOperand = '';
  operator        = null;
  resetNext       = false;
}

/* ---------- Delete last character ---------- */
function deleteLast(){
  if (currentOperand.length === 1 || currentOperand === 'Error'){
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
}

/* ---------- Wire up every button with one loop ---------- */
for (const button of allButtons){
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value  = button.dataset.value;

    if (action === 'number'){
      appendNumber(value);
    } else if (action === 'decimal'){
      appendDecimal();
    } else if (action === 'operator'){
      chooseOperator(value);
    } else if (action === 'equals'){
      compute();
    } else if (action === 'clear'){
      clearAll();
    } else if (action === 'delete'){
      deleteLast();
    }

    updateDisplay();
  });
}

/* ---------- Keyboard support ---------- */
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (e.key === '+' ) chooseOperator('+');
  else if (e.key === '-' ) chooseOperator('-');
  else if (e.key === '*' ) chooseOperator('×');
  else if (e.key === '/' ) chooseOperator('÷');
  else if (e.key === '%' ) chooseOperator('%');
  else if (e.key === 'Enter' || e.key === '=') compute();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else return;

  updateDisplay();
});

updateDisplay();
