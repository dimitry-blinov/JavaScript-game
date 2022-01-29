document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  container.classList.add('hidden');

  // Создание и возвращаем заголовок игры
  function createAppTitle() {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = 'Игра "Пары"';
    appTitle.classList.add('title');
    return appTitle;
  }

  // Поле для заполнение по вертикали/горизонтали
  const horizInp = document.querySelector('.quantity-horizontal');
  const vertInp = document.querySelector('.quantity-vert');

  // Создаем элементы в списке
  function createItem(elementList, array) {
    for (let i = 0; i < array.length; i++) {
      const item = document.createElement('li');
      const fontFace = document.createElement('span');
      const backFace = document.createElement('span');
      item.classList.add('card');
      item.style.width = `calc(900px / ${Number(horizInp.value)})`;
      fontFace.classList.add('font-card');
      backFace.classList.add('back-card');
      backFace.textContent = array[i];
      item.append(fontFace);
      item.append(backFace);
      elementList.append(item);
    }
  }

  // Перемешиваем карты
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Добавляем название игры и помещаем в контейнер
  const gameAppTitle = createAppTitle();
  container.append(gameAppTitle);

  // Создаем список и помещаем в контейнер
  const itemList = document.createElement('ul');
  itemList.classList.add('card-list');
  container.append(itemList);

  // Добавляем кнопку сыграть еще раз
  const cleanBtn = document.createElement('button');
  const menuBtn = document.createElement('button');
  const groupBtn = document.createElement('div');
  cleanBtn.textContent = 'Сыграть еще раз';
  menuBtn.textContent = 'Выйти в меню';
  menuBtn.classList.add('btn');
  cleanBtn.classList.add('btn', 'btn-start', 'btn-click');
  groupBtn.classList.add('group-btn', 'game-group');
  groupBtn.classList.add('hidden');
  groupBtn.append(cleanBtn);
  groupBtn.append(menuBtn);
  container.append(groupBtn);

  const timeCreateBlock = document.createElement('div');
  const textTimer = document.createElement('div');
  const textTimerAfter = document.createElement('div');
  const groupTimer = document.createElement('div');
  groupTimer.classList.add('timer-group');
  timeCreateBlock.classList.add('timer-block');
  textTimer.classList.add('timer-text');
  textTimerAfter.classList.add('timer-text', 'timer-text-after');
  textTimerAfter.textContent = 'секунд';
  textTimer.textContent = 'До конца игры осталось:';
  groupTimer.append(textTimer);
  groupTimer.append(timeCreateBlock);
  groupTimer.append(textTimerAfter);
  container.append(groupTimer);

  const timeBlock = document.querySelector('.timer-block');
  let currentBlock;
  let intervalId;

  // Массив для проверки карточек
  let arrayClassFlip = [];

  // Взаимодействие с кнопкой сыграть еще раз
  function btnClickReset(array) {
    const cards = document.querySelectorAll('.card');
    const btnClick = document.querySelector('.btn-click');
    btnClick.addEventListener('click', () => {
      cards.forEach((el) => {
        el.classList.remove('active');
        el.classList.remove('disabled');
        el.classList.remove('flip');
      });
      shuffle(array);
      setTimeout(() => {
        for (let i = 0; i < cards.length; i++) {
          cards[i].querySelector('.back-card').textContent = array[i];
        }
      }, 300);
      groupBtn.classList.add('hidden');
      timeBlock.textContent = '60';
      currentBlock = window.parseInt('60');
      timeBlock.style.color = 'black';
      textTimer.textContent = 'До конца игры осталось:';
      textTimerAfter.textContent = 'секунд';
      arrayClassFlip = [];
    });
    return array;
  }

  // Количество карт для сравнения в таймере
  let quantityCard;

  // Таймер
  function timer() {
    currentBlock -= 1;
    timeBlock.textContent = currentBlock;
    if (currentBlock === 0) {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.classList.add('disabled');
      });
      groupBtn.classList.remove('hidden');
      textTimerAfter.textContent = 'секунд';
      clearInterval(intervalId);
    }

    if (document.querySelectorAll('.active').length === quantityCard) {
      clearInterval(intervalId);
      groupBtn.classList.remove('hidden');
      textTimer.textContent = 'Вы выиграли, молодец!';
      timeBlock.textContent = '';
      textTimerAfter.textContent = '';
    }

    if (currentBlock <= 3) {
      timeBlock.style.color = 'red';
      if (currentBlock !== 0) {
        textTimerAfter.textContent = 'секунды';
      }
    }
  }

  // Game-App
  function getDoubleArr(totalQantity) {
    if (totalQantity % 2) {
      return;
    }

    const arr = [];
    const quantity = totalQantity / 2;

    for (let num = 1; num <= quantity; num++) {
      arr.push(num);
    }

    const arrCopy = arr.slice();
    const resultArr = arr.concat(arrCopy);

    // Перемешиваем карточки
    shuffle(resultArr);

    // Добавляем элементы в список
    createItem(itemList, resultArr);

    // Переворачиваем карточки
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.add('flip');
        // Проверка на наличие класса в массиве
        if (card.classList.contains('flip')) {
          arrayClassFlip.push(card);
          // Проверка длины массива из добавленных элементов с классом 'flip'
          if (arrayClassFlip.length === 2) {
            cards.forEach((element) => {
              element.classList.add('disabled');
            });
            // Если текст карточек одинаковый добавляем элементам класс 'active', а 'flip' убираем
            if (arrayClassFlip[0].textContent === arrayClassFlip[1].textContent) {
              cards.forEach((elCard) => {
                if (elCard.classList.contains('flip')) {
                  elCard.classList.add('active');
                  setTimeout(() => {
                    elCard.classList.remove('flip');
                  }, 300);
                } else {
                  cards.forEach((el) => {
                    el.classList.remove('disabled');
                  });
                }
              });
              arrayClassFlip = [];
            } else {
              setTimeout(() => {
                cards.forEach((el) => {
                  el.classList.remove('flip');
                  el.classList.remove('disabled');
                });
              }, 1000);
              arrayClassFlip = [];
            }
          }
        }

        // Таймер
        clearInterval(intervalId);
        btnClickReset(resultArr);
        intervalId = setInterval(timer, 1000);
      });

      // Появление кнопки "Сыграть еще раз"
      if (document.querySelectorAll('.active').length === totalQantity) {
        groupBtn.classList.remove('hidden');
        btnClickReset(resultArr);
      }
    });

    // eslint-disable-next-line consistent-return
    return resultArr;
  }

  // Добавляем карточки
  const menu = document.querySelector('.container-menu');
  const startGame = document.querySelector('.btn-start');
  const cleanInp = document.querySelector('.btn-clean');
  // Начать игру
  startGame.addEventListener('click', () => {
    if (!(horizInp.value % 2) && !(vertInp.value % 2)) {
      const resultOption = horizInp.value * vertInp.value;
      container.classList.remove('hidden');
      quantityCard = resultOption;
      getDoubleArr(resultOption);
      menu.classList.add('is-active');
      timeBlock.textContent = '60';
      currentBlock = window.parseInt('60');
      timeBlock.style.color = 'black';
    } else {
      horizInp.value = 4;
      vertInp.value = 4;
      container.classList.remove('hidden');
      const resultOption = horizInp.value * vertInp.value;
      quantityCard = resultOption;
      getDoubleArr(resultOption);
      menu.classList.add('is-active');
      timeBlock.textContent = '60';
      currentBlock = window.parseInt('60');
      timeBlock.style.color = 'black';
    }
  });

  // Кнопка очистить
  cleanInp.addEventListener('click', () => {
    horizInp.value = 2;
    vertInp.value = 2;
  });

  // Кнопка выйти в меню
  menuBtn.addEventListener('click', () => {
    delete getDoubleArr();
    const arr = document.querySelectorAll('.card');
    for (let i = 0; i < arr.length; i++) {
      arr[i].remove();
    }
    container.classList.add('hidden');
    groupBtn.classList.add('hidden');
    menu.classList.remove('is-active');
    textTimer.textContent = 'До конца игры осталось:';
    textTimerAfter.textContent = 'секунд';
  });
});
