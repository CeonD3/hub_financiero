const initKapital = () => {
    const forms = document.querySelectorAll('.formWACC');
    forms.forEach(form => {
        const uid = form.getAttribute('id');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sweet2.loading();
            const formData = new FormData(e.target);
            const url = uid ? '/kapital/' + uid + '/update' : '/kapital/store';
            helper.post(url, formData)
            .then(({success, data, message}) => {
                if (!success){
                    throw message;
                }
                setTimeout(() => {
                    if (uid) {
                        window.AppFinanceWeb.modules.forEach(module => {
                            module.$mount();
                        });
                        sweet2.success({text: message});
                    } else {
                        window.location.href = '/kapital/' + data.uid + '/resultados';                
                    }
                }, 2500);
            })
            .catch(error => {
                console.log(error);
                sweet2.show({type: 'error', html: error});
            });
        });
    });

    const pdFormInput = document.getElementById('pdFormInput');
    if (pdFormInput) {
        pdFormInput.addEventListener('keyup', (e) => {
            const value = e.target.value;
            let pc = 0; 
            if (Number(value) <= 100) {
                pc = 100 - value;
            }
            const pcFormInput = document.getElementById('pcFormInput');
            if (pcFormInput) {
                pcFormInput.value = pc;
            }
        });
    }

    $('#countryFormInput').on('select2:select', function (e) {
        const data = e.params.data;
        const country = data.text;
        const dateFormInput = document.getElementById('dateFormInput');
        const taxFormInput = document.getElementById('taxFormInput');
        const devaluationFormInput  = document.getElementById('devaluationFormInput');

        if (devaluationFormInput) {
            devaluationFormInput.value = country == 'Peru' ? '1.64' : '';
        }

        if (dateFormInput && dateFormInput.value.length > 0) {
            taxFormInput.value = "Cargando...";
            const year = dateFormInput.value.split('/').pop();
            const formData = new FormData();
            const uid = window.AppFinanceWeb.uid;
            formData.append('country', country);
            formData.append('year', year);
            formData.append('uid', uid);
            helper.post('/kapital/taxrate', formData)
            .then(({success, data, message}) => {
                if (!success){
                    throw message;
                }
                if (taxFormInput) {
                    taxFormInput.value = data.param.taxrate;
                }
            })
            .catch(error => {
                if (taxFormInput) {
                    taxFormInput.value = "";
                }
                console.log(error);
                sweet2.show({type: 'error', html: error});
            });
        }
    });
    
};

function collapseFaToggle(scope, toggle) {
    const collapseFaToggle = document.getElementById(toggle), 
          companyInputs = document.getElementsByName('companyInput');
    if (scope.classList.contains('collapsed')) {
        if (collapseFaToggle) {
            collapseFaToggle.classList.add('fa-toggle-off');
            collapseFaToggle.classList.remove('fa-toggle-on');    
        }
        if (companyInputs) {
            companyInputs.forEach(input => {            
                input.removeAttribute("required");
            });
        }
    } else {
        if (collapseFaToggle) {
            collapseFaToggle.classList.add('fa-toggle-on');
            collapseFaToggle.classList.remove('fa-toggle-off');
            if (companyInputs) {
                companyInputs.forEach(input => { 
                    input.addAttribute("required");
                });
            }
        }
    }
}

const initValora = () => {
    const storeUpdate = (uid, formData) => {
        const url = uid ? '/valora/' + uid + '/update' : '/valora/store';
        helper.post(url, formData)
        .then(({success, data, message}) => {
            if (!success) {
                throw message;
            }
            sweet2.success({text: message});
            setTimeout(() => {
                sweet2.loading({text: 'Redirigiendo a resultados...'}); 
                if (uid) {
                    /*window.AppFinanceWeb.modules.forEach(module => {
                        module.$mount();
                    });*/
                    window.location.href = '/valora/' + uid + '/resultados';
                } else {
                    window.location.href = '/valora/' + data.uid + '/resultados';
                }    
            }, 2000);
        })
        .catch(error => {
            sweet2.show({type: 'error', html: error});
        });
    }
    const forms = document.querySelectorAll('.formInputValora');
    forms.forEach(form => {
        const uid = form.getAttribute('id');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (uid) {
                sweet2.loading();
            } else {
                sweet2.loading({text: 'Estamos procensando su información, nos tomará algunos minutos en realizarlo. Cargando...'});
            }
            const formData = new FormData(e.target);
            storeUpdate(uid, formData);
        });
    });

    const forms2 = document.querySelectorAll('.formTemplateUserValora');
    forms2.forEach(form => {
        const uid = form.getAttribute('uid');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (uid) {
                sweet2.loading({text: 'Estamos procensando su información, nos tomará algunos minutos en realizarlo. Cargando...'});
            } else  {
                sweet2.loading();
            }
            const formData = new FormData(e.target);
            formData.append('uid', uid);
            helper.post(window.AppFinanceWeb.api + "/api/valora/upload", formData)
            .then(({success, data, message}) => {
                if (!success) {
                    throw message;
                }
                /*setTimeout(() => {
                    sweet2.loading({text: 'Estamos procensando su información, nos tomará algunos minutos en realizarlo. Cargando...'});
                    if (uid) {
                        window.AppFinanceWeb.modules.forEach(module => {
                            module.$mount();
                        });
                    } else {                        
                        const formData = new FormData();
                        formData.append('fileUsername', data.filename);
                        storeUpdate(uid, formData, true);                        
                    }
                }, 2000);*/
                let url = window.AppFinanceWeb.api;
                const fileUsername = document.getElementById('fileUsername');
                if (fileUsername) {
                    fileUsername.value = data.filename;
                }
                const fileUsernameUrl = document.getElementById('fileUsernameUrl'); 
                if (fileUsernameUrl) {
                    fileUsernameUrl.setAttribute("href", url + data.fileurl);
                }
                const fileUsernameAlert = document.getElementById('fileUsernameAlert');
                if (fileUsernameAlert) {
                    fileUsernameAlert.classList.remove("d-none");
                }
                e.target.reset();
                bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFileUsername')).hide();
                if (uid) {
                    setTimeout(() => {
                        window.AppFinanceWeb.modules.forEach(module => {
                            module.$mount();
                        });
                    }, 2000);
                }
                sweet2.success({text: message});
            })
            .catch(error => {
                sweet2.show({type: 'error', html: error});
            });
        });
    });
}

const initFinance = () => {
    /*const checks = document.querySelectorAll('.bs-check-report');
    const cards =  document.querySelectorAll('.bs-card-report');
    checks.forEach(check => {
        const id = check.getAttribute('id');
        check.addEventListener('change', (e) => {
            const checked = e.target.checked;
            if (cards.length > 0) {
                cards.forEach(card => {
                    const dfor = card.getAttribute('for'); 
                    if (dfor == id) {
                        if (checked) {
                            card.classList.add('active');
                        } else {
                            card.classList.remove('active');
                        }
                    }
                });
            }
        });
    });*/

    const checks = document.querySelectorAll('.check-report');
    const checkforms = document.querySelectorAll('.checkform');
    checks.forEach(check => {
        check.addEventListener('change', ({target}) => {
            const { value, checked } = target;
            checkforms.forEach((checkform, index) => {
                checkform.classList.remove('text-primary');
                if (checked) {
                    switch (value.trim()) {
                        case 'reporte-datos':
                            if ([0, 1].includes(index)) {
                                checkform.classList.add('text-primary');
                            }
                        break;
                        case 'reporte-detallado':
                            if ([0, 1, 2].includes(index)) {
                                checkform.classList.add('text-primary');
                            }
                        break;
                        case 'consultoria-especializada':
                            if ([0, 1, 2, 3].includes(index)) {
                                checkform.classList.add('text-primary');
                            }
                        break;
                    }
                }
            });
        });
    });
    /*const formReportKapital = document.getElementById('formReportKapital');
    if (formReportKapital) {
        const uid = window.AppFinanceWeb.uid;
        console.log(formReportKapital);
        formReportKapital.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const slug = formData.get('report');
            sweet2.loading();
            console.log(`/kapital/${uid}/reportes/${slug}`);
            // window.location.href = `/kapital/${uid}/reportes/${slug}`;
            helper.post(`/kapital/${uid}/reportes/generar`, formData)
            .then(({success, data, message}) => {
                if (!success) {
                    throw message;
                }
            
                window.location.href = `/kapital/${uid}/repostes/${slug}`;
                console.log(data);
                sweet2.success({text: message});
            })
            .catch(error => {
                sweet2.show({type: 'error', html: error});
            });
        });
    }*/


    const viewport = (url, name) => {
        const extension = url.split('.').pop().toLowerCase();
        const 
        $docs    = ["doc", "docx", "xlsx", "xls", "pptx", "ppt", "pdf", "mpp", "ppsx", "xlsm", "pptm"],
        $images  = ["jpg", "jpeg", "png", "gif"],
        $videos  = ["mp4"],
        $embebidos  = ["embebido"];
        let $html       = '';
        const title = `<div class="col"><h3>${name}</h3></div>`;
        const btnDescarga = `<div class="alert alert-warning" role="alert">
                                Si aún no puede visualizar el contenido, <b><a href="${url}" target="_blank" > click aquí para Descargar Archivo </a></b> y espere unos segundos.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`;    
            
        if ($docs.includes(extension)) {
            $html = `${title}${btnDescarga}
                <div class='col' style='height:100%'>
                    <div id="warning-iframe-no-loaded" class="alert alert-warning" role="alert">
                        Si aún no puede visualizar el contenido , por favor haga <b><a href='' onclick="return window.realoadIframe(this, '#iframeA001','https://docs.google.com/viewer?url=${url}&embedded=true')" >clic aquí</a></b> y espere unos segundos.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <iframe name='destinoA' onload='window.removeReloadAlertIframeNoLoaded()' width='100%'  height='100%' id='iframeA001' src='https://docs.google.com/viewer?url=${url}&embedded=true' scrolling='hidden'  frameborder='0px' cellSpacing='0' cellPadding='0'  target='_self'>
                        Tu Navegador no esta configurado para soportar estos frames
                    </iframe>
                </div>`;
        } else if ($videos.includes(extension)) {
            $html = `<div class="col">
                        ${title}
                        <video width="100%" height="100%" controls>
                            <source src="${url}" type="video/${extension}">
                            Your browser does not support the video tag.
                        </video>
                    </div>`;
        } else if ($images.includes(extension)) {
            $html = `<div class="col">${title}<img src="${url}" alt="Imagen" width="100%" height="100%"></div>`;
        } else {
            $html = `<div class='col' style='height:100%'>${url}</div>`;
        }
        return $html;
    }


    const btnviewfiles = document.querySelectorAll('.btnviewfile');
    const containerviewer = document.querySelector('#containerviewer');
    btnviewfiles.forEach((btn, idx) => {
        const url = btn.getAttribute('d-url');
        const name = btn.getAttribute('d-name');
        btn.addEventListener('click', (e) => {
            if (containerviewer) {
                containerviewer.innerHTML = viewport(url, name);
            }
        });
        if (idx == 0) {
            if (containerviewer) {
                containerviewer.innerHTML = viewport(url, name);
            }
        }
    });

    window.removeReloadAlertIframeNoLoaded = function(){
        $("#warning-iframe-no-loaded").remove();
    }
    window.realoadIframe = function(tag, id,url) {
        $(id).attr("src", url);
        return false;
    }

    const initReportKapital = () => {
        const index = function ({scope, uid}) {
            let self = {};
            return new Vue({
                el: '#' + scope,
                data() {
                    return {
                        designs: [],
                        design_contents: [],
                        loading: true,
                        all_checked: false
                    }
                },
                created: function() {
                    self = this;
                },
                mounted: function () {
                    self.initialize();
                },
                watch: {
                },
                computed: {
                },
                methods: {
                    initialize: function () {
                        self.onList();
                    },
                    onList: () => {
                        self.loading = true;
                        helper.post('/kapital/' + uid + '/reportes/list')
                        .then(function ({success, data, message}) {
                            if (!success) {
                                throw message;
                            }
                            self.designs = data.designs;
                            self.design_contents = data.design_contents;
                            self.loading = false;
                            setTimeout(() => {
                                self.onContentEvent();
                            }, 500);
                        })
                        .catch(function (err) {
                            console.log(err);
                            sweet2.error({html: err});
                        });
                    },
                    onFormReport: (e) => {
                        e.preventDefault();
                        if (self.all_checked) {
                            const modalCotizar = bootstrap.Modal.getOrCreateInstance(document.getElementById('kt_modal_cotizar'));
                            return modalCotizar.show();
                        }
                        const formData = new FormData(e.target);
                        const report = formData.get('report');
                        sweet2.loading();
                        window.location.href = `/kapital/${uid}/reportes/${report}`;
                    },
                    onContentEvent: () => {
                        const checks = document.querySelectorAll('input[name=report]');
                        const checkforms = document.querySelectorAll('.checkform');
                        checks.forEach(check => {
                            check.addEventListener('change', ({target}) => {
                                const contentId = target.getAttribute('data-content-id');
                                const { value, checked } = target;
                                checkforms.forEach((checkform, index) => {
                                    checkform.classList.remove('text-primary');
                                    if (checked) {
                                        switch (Number(contentId)) {
                                            case 1:
                                                if ([0].includes(index)) {
                                                    checkform.classList.add('text-primary');
                                                    self.all_checked = false;
                                                }
                                            break;
                                            case 2:
                                                if ([0, 1].includes(index)) {
                                                    checkform.classList.add('text-primary');
                                                    self.all_checked = false;
                                                }
                                            break;
                                            case 3:
                                                if ([0, 1, 2].includes(index)) {
                                                    checkform.classList.add('text-primary');
                                                    self.all_checked = true;
                                                }
                                            break;
                                        }
                                    }
                                });
                            });
                        });
                    },
                    onQuote: () => {
                        /*sweet2.loading();
                        helper.post('/kapital/' + uid + '/cotizacion')
                        .then(function ({success, data, message}) {
                            if (!success) {
                                throw message;
                            }
                            sweet2.error({html: err});
                        })
                        .catch(function (err) {
                            console.log(err);
                            sweet2.error({html: err});
                        });*/
                    }
                }
            });
        };
        const indexScope = 'AppReportKapitalWeb';
        const indexContainer = document.getElementById(indexScope);
        if (indexContainer) {
            const app = index({scope:indexScope, uid:window.AppFinanceWeb.uid});
            window.AppFinanceWeb.modules.push(app);
        }
    }

    const initReportValora = () => {
        const index = function ({scope, uid}) {
            let self = {};
            return new Vue({
                el: '#' + scope,
                data() {
                    return {
                        designs: [],
                        design_contents: [],
                        loading: true,
                        all_checked: false
                    }
                },
                created: function() {
                    self = this;
                },
                mounted: function () {
                    self.initialize();
                },
                watch: {
                },
                computed: {
                },
                methods: {
                    initialize: function () {
                        self.onList();
                    },
                    onList: () => {
                        self.loading = true;
                        helper.post('/valora/' + uid + '/reportes/list')
                        .then(function ({success, data, message}) {
                            if (!success) {
                                throw message;
                            }
                            self.designs = data.designs;
                            self.design_contents = data.design_contents;
                            self.loading = false;
                            setTimeout(() => {
                                self.onContentEvent();
                            }, 500);
                        })
                        .catch(function (err) {
                            console.log(err);
                            sweet2.error({html: err});
                        });
                    },
                    onFormReport: (e) => {
                        e.preventDefault();
                        if (self.all_checked) {
                            const modalCotizar = bootstrap.Modal.getOrCreateInstance(document.getElementById('kt_modal_cotizar'));
                            return modalCotizar.show();
                        }
                        const formData = new FormData(e.target);
                        const report = formData.get('report');
                        sweet2.loading();
                        window.location.href = `/valora/${uid}/reportes/${report}`;
                    },
                    onContentEvent: () => {
                        const checks = document.querySelectorAll('input[name=report]');
                        const checkforms = document.querySelectorAll('.checkform');
                        checks.forEach(check => {
                            check.addEventListener('change', ({target}) => {
                                const contentId = target.getAttribute('data-content-id');
                                const { value, checked } = target;
                                checkforms.forEach((checkform, index) => {
                                    checkform.classList.remove('text-primary');
                                    if (checked) {
                                        switch (Number(contentId)) {
                                            case 1:
                                                if ([0].includes(index)) {
                                                    checkform.classList.add('text-primary');
                                                    self.all_checked = false;
                                                }
                                            break;
                                            case 2:
                                                if ([0, 1].includes(index)) {
                                                    checkform.classList.add('text-primary');
                                                    self.all_checked = false;
                                                }
                                            break;
                                            case 3:
                                                if ([0, 1, 2].includes(index)) {
                                                    checkform.classList.add('text-primary');
                                                    self.all_checked = true;
                                                }
                                            break;
                                        }
                                    }
                                });
                            });
                        });
                    },
                }
            });
        };
        const indexScope = 'AppReportValoraWeb';
        const indexContainer = document.getElementById(indexScope);
        if (indexContainer) {
            const app = index({scope:indexScope, uid:window.AppFinanceWeb.uid});
            window.AppFinanceWeb.modules.push(app);
        }
    }

    initReportKapital();
    initReportValora();
}


document.addEventListener('DOMContentLoaded', () => {
    initFinance();
    initKapital();
    initValora();
});
