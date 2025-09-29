const AppLoginAdmin = {
    handleValidation: (form) => {
        return FormValidation.formValidation(
			form,
			{
				fields: {					
					'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'The value is not a valid email address',
                            },
							notEmpty: {
								message: 'Email es un campo requerido'
							}
						}
					},
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'Password es un campo requerido'
                            }
                        }
                    } 
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
				}
			}
		);
    },
    handleSubmit: (submitButton, form) => {
        const validator = AppLoginAdmin.handleValidation(form);
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();
            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');
                    // Disable button to avoid multiple click 
                    submitButton.disabled = true;
                    const formData = new FormData(form);
                    window.helper.post('/admin/signin', formData)
                    .then(rsp => {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        location.href = '/admin';
                    })
                    .catch(error => {
                        submitButton.setAttribute('data-kt-indicator', 'off');
                        submitButton.disabled = false;
                        sweet2.error({text: error});
                    });						
                }
            });
		});
    },
    signin: () => {
        const form = document.querySelector('#kt_sign_in_form');
        const submitButton = document.querySelector('#kt_sign_in_submit');
        AppLoginAdmin.handleSubmit(submitButton, form);
    },
    init: () => {
        AppLoginAdmin.signin();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AppLoginAdmin.init();
});
