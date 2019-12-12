
const setMaxNumber = (number) => {
  localStorage.maxNumber = number;
  const maxNumberSpan = document.getElementById('maxNumber');
  maxNumberSpan.textContent = `Max number: ${number}`;
};

const setAttempt = (number) => {
  localStorage.attempts = parseInt(localStorage.attempts) + number;
  const attemptSpan = document.getElementById('attemptNumber');
  attemptSpan.textContent = `Attempts: ${localStorage.attempts}`;
};

const setInitialValues = () => {
  localStorage.attempts = 0;
  localStorage.randomNumber = 0;
  localStorage.maxNumber = 0;
  setMaxNumber(0);
  setAttempt(0);
};

const setSquareAndSpanColor = (id, color) => {
  const square = document.getElementById(`square_${id}`);
  const span = document.getElementById(`span_${id}`);
  square.style.borderColor = color;
  span.style.color = color;
  span.style.fontWeight = 'bold';
};

const randomNumber = () => {
  localStorage.randomNumber = Math.floor(Math.random() * localStorage.maxNumber);
};

const showNumbers = async () => {
  let primes = [];
  let maxNumber = localStorage.maxNumber;

  for (let x = 1; x <= maxNumber; x++) {
    primes.push(x);
  }

  await showResult(primes, '');
}

const showResult = async (arr = [], orderType = '') => {
  return new Promise(async (resolve) => {
    const resultElement = document.getElementById('result');
    const title = document.createElement('span');
    title.style.fontWeight = 'bold';
    title.textContent = orderType;
    resultElement.appendChild(title);
    resultElement.appendChild(document.createElement('br'));
    for (let x = 0; x < arr.length; x++) {
      const squarePromise = new Promise((resolve) => {
        createSquare(arr[x]);
        setTimeout(() => resolve(), 50);
      });

      await squarePromise;
    }
    resolve();
  })
};

const clearResult = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const createSquare = (squareValue) => {
  const resultElement = document.getElementById('result');
  const square = document.createElement('div');
  square.id = `square_${squareValue}`;
  square.className = 'square';
  square.style.margin = '2px';
  square.style.borderColor = 'black';
  square.style.cursor = 'pointer';
  square.onclick = (event) => onClickSquire(event);
  const span = document.createElement('span');
  span.id = `span_${squareValue}`;
  span.style.fontSize = '22px';
  span.textContent = squareValue;
  square.appendChild(span);

  resultElement.appendChild(square);
}

const onClickSquire = (event) => {
  const squareId = event.target.id;
  const square = document.getElementById(squareId);
  const indexId = squareId.indexOf('_');
  const id = squareId.substr(indexId + 1, squareId.length);
  if (parseInt(event.target.textContent) === parseInt(localStorage.randomNumber)) {
    setSquareAndSpanColor(id, 'green');
    alert(`It's the number (${parseInt(event.target.textContent)})! You win! :D`);
    return;
  } else {
    setSquareAndSpanColor(id, 'blue');
    setAttempt(1);
  }

  choosedNumber(event.target.textContent);
}

const choosedNumber = async (userNumber) => {
  let startNumber = 1;
  let endNumber = 0;
  if (parseInt(userNumber) > parseInt(localStorage.randomNumber)) {
    startNumber = parseInt(userNumber) + 1;
    endNumber = parseInt(localStorage.maxNumber);
  } else {
    if (parseInt(localStorage.randomNumber) < parseInt(userNumber))
      endNumber =  parseInt(localStorage.randomNumber) - 1;
    else {
      endNumber =  parseInt(userNumber) - 1;
    }
  }

  for (x = startNumber; x <= endNumber; x++) {
    const squarePromise = new Promise((resolve) => {
      const square = document.getElementById(`square_${x}`);
      const span = document.getElementById(`span_${x}`);
      if (square.style.borderColor === 'black') {
        setSquareAndSpanColor(x, 'red');
        setTimeout(() => resolve(), 50);
      } else {
        resolve();
      }
    });

    await squarePromise;
  }
}

btnPlayGame.onclick = () => {
  setInitialValues();
  let maxNumber = window.prompt('Set max number :)', 100)
  if (!isNaN(maxNumber)) {
    setMaxNumber(maxNumber);
    randomNumber();
    clearResult(document.getElementById('result'));
    showNumbers();
    alert('Now, try to guess what number I choosed! :D');
  } else {
    alert('You have to type a valid number!');
  }
};
