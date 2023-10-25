let isPopupOpen = false;

function moveBackground() {
  const mainBg = document.querySelector(".main__background");

  const handleMouseMove = (e) => {
    if (!isPopupOpen && window.innerWidth >= 1250) {
      const x = e.clientX / window.innerWidth;
      mainBg.style.transform = `translateX(${-x * 50}px)`;
    }
  };

  document.addEventListener('mousemove', handleMouseMove);

  window.addEventListener('resize', () => {
    if (window.innerWidth < 1250) {
      mainBg.style.transform = 'translateX(0)';
    }
  });
}

function modalWindow() {
  const form = document.querySelector(".form");
  const buttonOpenForm = document.querySelectorAll(".menu__popup");
  const body = document.querySelector('.body');

  buttonOpenForm.forEach((button) => {
    button.addEventListener("click", () => {
      form.classList.add("form__open");
      form.classList.remove("form__close");
      body.classList.add('body__scroll');
      isPopupOpen = true;
    });
  });

  const buttonCloseForm = document.querySelector('.form__button');
  if (buttonCloseForm) {
    buttonCloseForm.addEventListener('click', () => {
      form.classList.add("form__close");
      form.classList.remove("form__open");
      body.classList.remove('body__scroll');

      form.addEventListener('transitionend', () => {
        form.classList.remove("form__close");
        isPopupOpen = false;
      }, { once: true });
    });
  }
}

function handleDocumentClick(event) {
  const target = event.target;
  const button = document.querySelector('.burger-menu__button');
  const saleDetailLink = document.querySelector('[aria-menu="burger-menu"]');
  const header = document.querySelector('header');

  if (!target.closest('.menu__list--open') && !target.closest('.burger-menu__burger--open')) {
    saleDetailLink.classList.remove('menu__list--open');
    button.classList.remove('burger-menu__burger--open');
    header.classList.add('header');
  }
}

function sendFormServer() {
  const form = document.querySelector(".form__block");


  const submitButton = form.querySelector(".form__send");


  form.addEventListener("submit", (event) => {

    event.preventDefault();

    submitButton.disabled = true;

    const dateArrivalInput = form.querySelector("#date__arrival");
    const dateDepartureInput = form.querySelector("#date__departure");
    const dateAmountInput = form.querySelector("#date__amount");

    if (!dateArrivalInput.value || !dateDepartureInput.value || !dateAmountInput.value) {
      alert("Пожалуйста, заполните все обязательные поля.");
      submitButton.disabled = false; // Re-enable the button
    } else {
      submitForm();
    }
  });

  function submitForm() {
    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Форма успешно отправлена!");
          form.reset();
        } else {
          alert("Произошла ошибка при отправке формы.");
        }
      })
      .catch((error) => {
        alert("Произошла ошибка при отправке формы: " + error.message);
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  }
}

function setupCurrentDate() {
  const dateArrivalInput = document.getElementById("date__arrival");
  const dateDeparture = document.getElementById('date__departure');

  const currentDate = new Date();

  const formattedDate = currentDate.toISOString().split('T')[0];


  dateArrivalInput.min = formattedDate;

  dateArrivalInput.addEventListener("input", () => {
    const selectedDate = dateArrivalInput.value;

    if (selectedDate === formattedDate) {
      alert("Выбор текущей даты недоступен. Пожалуйста, выберите другую дату.");
      dateArrivalInput.value = "";
    }
  });
}

function burgerMenu() {
  const button = document.querySelector('.burger-menu__button');
  const saleDetailLink = document.querySelector('[aria-menu="burger-menu"]');
  const header = document.querySelector('.header');

  if (button && saleDetailLink && header) {
    button.addEventListener('click', () => {
      button.classList.toggle('burger-menu__burger--open');
      saleDetailLink.classList.toggle('menu__list--open');
      header.classList.toggle('header');
    })
  }
}

function handleDOMContentLoaded() {
  moveBackground();
  modalWindow();
  sendFormServer();
  setupCurrentDate();
  burgerMenu();
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
document.addEventListener('click', handleDocumentClick);
