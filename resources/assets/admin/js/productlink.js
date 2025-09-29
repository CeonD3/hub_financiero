const AppGraphicAdmin = {
    index: function ({scope, periodProductId}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    graphics: [],
                    templates: [],
                    grapichSelected: Object.create({}),
                    grapichsLoad: false,
                    templatesLoad: false,
                    templateProcess: false,
                    template: {},
                    masterTemplates: []
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
                    self.onGraphics();
                },
                onGraphics: () => {
                    self.grapichsLoad = false;
                    helper.post('/admin/linea-grafica/list')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.graphics = rsp.data.graphics;
                        self.grapichsLoad = true;
                        if (self.graphics?.length > 0) {
                            self.onTemplates(0);
                        } else {
                            self.templatesLoad = true;
                        }
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onTemplates: function (index) {
                    if (self.templateProcess) {
                        sweet2.error({html: 'Hay un proceso que se esta ejecutando'});
                        return;
                    }
                    self.templates = [];
                    self.templateProcess = true;
                    self.templatesLoad = false;
                    self.grapichSelected = self.graphics[index];

                    const formData = new FormData();
                    formData.append('userId', AppMain.userId);
                    formData.append('periodProductId', periodProductId);
                    formData.append('all', 1);
                    helper.post('/admin/linea-grafica/' + self.grapichSelected.id + '/templates', formData)
                    .then(function (rsp) {
                        self.templatesLoad = true;
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.templates = rsp.data.templates;
                        self.templateProcess = false;
                    })
                    .catch(function (err) {
                        console.log(err);
                        self.templateProcess = false;
                        sweet2.error({html: err});
                    });
                },
                onFormProductLink: function () {
                    self.masterTemplates = [];
                    sweet2.loading();
                    helper.post('/admin/vinculaciones/' + periodProductId + '/linea-grafica/' + self.grapichSelected.id + '/maestras')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.masterTemplates = rsp.data.masterTemplates;
                        sweet2.loading(false);                    
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalLinkProduct')).show();
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                },
                onProductLink: function (e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    formData.append('companyId', window.AppMain.companyId);
                    sweet2.loading();
                    helper.post('/admin/vinculaciones/' + periodProductId + '/plantillas/save', formData)
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        const template = rsp.data.template;
                        self.onActiveTemplate();
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalLinkProduct')).hide();
                        sweet2.show({
                            type: 'success',
                            title: rsp.message,
                            html: `<h5>Recuerda</h5><p>De ingresar al panel complementario para sincrozinzar los datos del producto a la plantilla</p>`,
                            confirmButtonText: 'Ingresar',
                            onOk: () => {
                                self.onViewerFile(template);
                            }
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });   
                },
                onRemove: function (id) {
                    sweet2.question({
                        title: '¿Estás seguro de eliminar esta plantilla?',
                        onOk: function () {
                            sweet2.loading();
                            helper.post('/admin/vinculaciones/plantillas/' + id + '/remove')
                            .then(function (rsp) {
                                if (!rsp.success) {
                                    throw rsp.message;
                                }
                                self.onActiveTemplate();
                                sweet2.success({html: rsp.message});
                            })
                            .catch(function (err) {
                                console.log(err);
                                sweet2.error({html: err});
                            });                                    
                        }
                    });
                },
                onActiveTemplate: function () {
                    let index = 0;
                    for (let i = 0; i < self.graphics.length; i++) {
                        if (self.graphics[i].id == self.grapichSelected.id) {
                            index = i;                                    
                            break;
                        }
                    }
                    self.onTemplates(index);
                },
                onReloadTemplate: function (id) {
                    let index = 0;
                    for (let i = 0; i < self.graphics.length; i++) {
                        if (self.graphics[i].id == id) {
                            index = i;                      
                            break;
                        }
                    }
                    self.onTemplates(index);
                },
                exportTemplate: function (id) {
                    sweet2.loading();
                    const formData = new FormData();
                    formData.append('userId', window.AppMain.userId);
                    helper.post('/admin/plantillas/periodos/' + id + '/export', formData)
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        var anchor = document.createElement('a');
                        anchor.href = rsp.data.pathname;
                        anchor.target="_blank";
                        anchor.click();
                        sweet2.success({html: rsp.message});
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    }); 
                },
                onViewerFile: function (item) {
                    const myWindow = window.open(item.web_url, '', "width=1200,height=800,toolbar=0");
                    myWindow.focus();
                },
                onViewerImage: function (item) {
                    self.template = item;
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTemplateView')).show();
                }
            }
        });
    },
    init: () => {
        const indexScope = 'AppGraphicAdmin';
        const indexContainer = document.getElementById(indexScope);
        if (indexContainer) {
            const periodProductId = indexContainer.getAttribute('data-id');
            indexContainer.removeAttribute('data-id');
            AppGraphicAdmin.index({scope:indexScope, periodProductId:periodProductId});
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AppGraphicAdmin.init();
});