function mostraLogin(fail) {
    if (fail) {
        const formElement = document.getElementById('loginForm');
        const messageElement = formElement.elements.message;
        const buttonElement = formElement.elements.submit;
        onLoginFail(formElement, messageElement, buttonElement, fail)
    }

    document.getElementById('loginPopup').style.display = '';
    document.getElementById('loginForm').onsubmit = (e) => {
        const buttonElement = e.submitter;
        const userElement = e.target.elements.user;
        const pswElement = e.target.elements.psw;
        const formElement = e.target;
        const messageElement = formElement.elements.message;
        const formParent = formElement.parentElement;
        // como um erro durante essa função causa o recarregamnto da página é melhor colocar um bloco try/catch para poder analizar erros
        try {
            // Por segurança. Assim evita-se que os valores sejam enviados ao servidor http ou mostrados na barra de navegação
            disableFormElements(formElement);

            messageElement.value = ""

            buttonElement.classList.add('loading');

            const user = userElement.value;
            const psw = pswElement.value;

            pswElement.value = "";

            if (user == 'ok') {
                setTimeout(() => {
                    onLoginSucceed(formElement, formParent, buttonElement);
                }, 1000);
            } else if (user == 'faillog') {
                setTimeout(() => {
                    onLoginFail(formElement, messageElement, buttonElement, { errorCode: 6 });
                }, 1000);
            } else if (user == 'failcon') {
                setTimeout(() => {
                    onLoginFail(formElement, messageElement, buttonElement, { errorCode: 7 });
                }, 1000);
            } else if (user == 'losecon') {
                setTimeout(() => {
                    onLoginSucceed(formElement, formParent, buttonElement);
                    setTimeout(() => {
                        mostraLogin({ errorCode: 8 });
                    }, Number(psw));
                }, 1000);
            } else {
               Connect(user, psw, () => {
                    onLoginSucceed(formElement, formParent, buttonElement);
                }, (reason) => {
                   onLoginFail(formElement, messageElement, buttonElement, reason);
                 });
            }
        }
        catch (e) {
            console.error(e);
            messageElement.value = "Algo inseperado aconteceu...";
        }
        return false;
    }
}

function onLoginSucceed(formElement, formParent, buttonElement) {
    buttonElement.classList.remove('loading');
    formParent.style.display = 'none';
    enableFormElements(formElement);
}

function onLoginFail(formElement, messageElement, buttonElement, reason) {
    buttonElement.classList.remove('loading');
    switch (reason.errorCode) {
        case 6:
            messageElement.value = "Usuário e/ou senha inválidos.";
            break;
        case 7:
            messageElement.value = "Não foi possível conectar ao servidor.";
            break;
        case 8:
            messageElement.value = "A conexão com o servidor foi perdida."
            break;
        default:
            messageElement.value = reason.errorMessage;

    }
    enableFormElements(formElement);
}

function disableFormElements(form) {
    for (i = 0; i < form.elements.length; i++) {
        form.elements[i].disabled = true;
    }
}

function enableFormElements(form) {
    for (i = 0; i < form.elements.length; i++) {
        form.elements[i].disabled = false;
    }
}

mostraLogin();
