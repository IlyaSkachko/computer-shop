function registration() {
    const name = document.querySelector('.reg_name').value;
    const surname = document.querySelector('.reg_surname').value;
    const phone = document.querySelector('.reg_phone').value;
    const email = document.querySelector('.reg_email').value;
    const login = document.querySelector('.reg_login').value;
    const password = document.querySelector('.reg_pass').value;
    const confirmPassword = document.querySelector('.reg_confirmPass').value;

    if (validateFields(name, surname, email, phone, login, password, confirmPassword)) {


        const data = {
            name, surname, email, phone, login, password
        };
        const jsonData = JSON.stringify(data);


        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/registration', true);

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                window.location.href="/"
            } else {
                const response = JSON.parse(xhr.responseText);
                alert(response.error);
            }
        };

        xhr.onerror = function () {
            alert('Error');
        };

        xhr.send(jsonData);

    }

}

function validateFields(name, surname, email, phone, login, password, confirmPassword) {
    const nameValue = name.trim();
    const surnameValue = surname.trim();
    const phoneValue = phone.trim();
    const emailValue = email.trim();
    const loginValue = login.trim();
    const passwordValue = password.trim();
    const confirmPasswordValue = confirmPassword.trim();

    // Регулярные выражения для проверки валидности полей
    const nameRegex = /^[a-zA-Zа-яА-Я]+$/; // Только буквы
    const phoneRegex = /^\+?\d{10,13}$/; // 10 - 12 цифр
    const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/; // Валидный формат email
    const loginRegex = /^[a-zA-Z0-9_-]{4,}$/; // Минимум 4 символа, только буквы, цифры, дефис и подчеркивание
    const passwordRegex = /^.{8,}$/; // Минимум 8 символов, должны быть буквы и цифры
    const confirmPasswordRegex = new RegExp(`^${passwordValue}$`); // Проверка на совпадение с паролем

    const isValidName = nameRegex.test(nameValue);
    const isValidSurname = nameRegex.test(surnameValue);
    const isValidPhone = phoneRegex.test(phoneValue);
    const isValidEmail = emailRegex.test(emailValue);
    const isValidLogin = loginRegex.test(loginValue);
    const isValidPassword = passwordRegex.test(passwordValue);
    const isValidConfirmPassword =
        confirmPasswordRegex.test(confirmPasswordValue);


    if (!isValidName || !isValidSurname) {
        alert("Неверный формат имени или фамилии");
    } else if (!isValidPhone) {
        alert("Неверный формат номера телефона");
    } else if (!isValidEmail) {
        alert("Неверный формат электронной почты");
    } else if (passwordValue.length < 8) {
        alert("Неверный формат пароля. Пароль должен содержать минимум 8 символов");
        return false;
    } else if (!isValidConfirmPassword) {
        alert("Несовпадают пароли");
    } else if (!isValidLogin) {
        alert("Неккоректный логин. Минимум 4 символа, только буквы, цифры, дефис и подчеркивание");
    }

    // Возвращаем булевое значение в зависимости от результатов валидации всех полей
    return (
        isValidName &&
        isValidSurname &&
        isValidPhone &&
        isValidEmail &&
        isValidLogin &&
        isValidPassword &&
        isValidConfirmPassword
    );
}
