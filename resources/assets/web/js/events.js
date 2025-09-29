
const formSuscriptions = document.querySelectorAll('.formSuscription');
formSuscriptions.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sweet2.loading();
        const formData = new FormData(e.target);
        helper.post(window.AppFinanceWeb.margarita + '/contact/suscription', formData)
        .then(({success, data, message}) => {
            if (!success) {
                throw message;
            }
            e.target.reset();
            sweet2.success({text: message});
        }).catch((err) => {
            console.log(err);
            sweet2.error({text: err});
        });
    });
});

const formContacts = document.querySelectorAll('.formContact');
formContacts.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sweet2.loading();
        const formData = new FormData(e.target);
        helper.post(window.AppFinanceWeb.margarita + '/contact/message', formData)
        .then(({success, data, message}) => {
            if (!success) {
                throw message;
            }
            e.target.reset();
            sweet2.success({text: message});
        }).catch((err) => {
            console.log(err);
            sweet2.error({text: err});
        });
    });
});

const formMessages = document.querySelectorAll('.formMessage');
formMessages.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sweet2.loading();
        const formData = new FormData(e.target);
        helper.post(window.AppFinanceWeb.margarita + '/message/new', formData)
        .then(({success, data, message}) => {
            if (!success) {
                throw message;
            }
            e.target.reset();
            sweet2.success({text: message});
        }).catch((err) => {
            console.log(err);
            sweet2.error({text: err});
        });
    });
});