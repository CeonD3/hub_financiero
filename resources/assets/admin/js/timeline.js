const AppTimeLineAdmin = {
    index: function (container) {
        let self = {};
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    templates: [],
                    labels: [],
                    loadList: false,
                    search: ''
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
                items: function() {
                    return self.filteredItems(self.templates);
                },
            },
            methods: {
                initialize: function () {
                    self.onListService();
                },
                onStoreTemplate: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('companyId', AppMain.companyId);
                    helper.post('/admin/linea-tiempo/store', formData)
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTemplate')).hide();
                        e.target.reset();
                        self.onListService();
                        sweet2.success({text: rsp.message});
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                    console.log(e);
                },
                onListService: () => {
                    self.loadList = false;
                    helper.post('/admin/linea-tiempo/list')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.templates = rsp.data.templates;
                        self.onSelect2(rsp.data.labels);
                        self.loadList = true;
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onSelect2: (items) => {
                    let data = [];
                    items.forEach(ele => {
                        data.push({id: ele.id, text: ele.name});
                    });
                    $('.js-select2').select2({
                        placeholder: 'SELECCIONE',
                        tags: true,
                        dropdownParent: $('#modalTemplate'),
                        data: data
                    });
                },
                filteredItems: function (data) {
                    return data.filter(function(val, index) {
                        let item = "";
                        if (val.name != undefined) {
                            item = val.name;
                        }
                        item = item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        return item.indexOf(self.search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())!== -1;
                    });
                },
            }
        });
    },
    show: function (container, id) {
        let self = {};
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    templates: [],
                    loadList: false,
                    myDropzone: {},
                    template: {},
                    search: '',
                    fileId: 0
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
                items: function() {
                    return self.filteredItems(self.templates);
                },
            },
            methods: {
                initialize: function () {
                    self.onListService();
                    self.myDropzone = new Dropzone("#kt_dropzonejs_example_1", {
                        url: '/admin/linea-tiempo/' + id + '/upload', // Set the url for your upload script location
                        paramName: "file", // The name that will be used to transfer the file
                        maxFiles: 1,
                        maxFilesize: 20, // MB
                        addRemoveLinks: true,
                        uploadMultiple: true,
                        //autoProcessQueue: false,
                        acceptedFiles: '.ppt,.pptx'
                    });

                    self.myDropzone.on('sending', function(file, xhr, formData){
                        formData.append('companyId', AppMain.companyId);
                    });
                    
                    self.myDropzone.on("complete", function (progress) {
                        if (self.myDropzone.getUploadingFiles().length == 0 && 
                            self.myDropzone.getQueuedFiles().length == 0) {
                            console.log('complete all');
                        }
                        const rsp = JSON.parse(progress.xhr.response);
                        const templates = rsp.data.templates;
                        sweet2.show({
                            type: 'success',
                            title: rsp.message,
                            html: `<h5>Recuerda</h5><p>De ingresar al panel complementario para visualizar las etiquetas de los atributos del producto</p>`,
                            confirmButtonText: 'Ingresar',
                            onOk: () => {
                                if (templates.length > 0) {
                                    self.onViewerFile(templates[0]);
                                }
                            }
                        });
                        self.onListService();
                    });

                },
                onUploadFile: () => {
                    self.myDropzone.processQueue();
                },
                onStoreTemplate: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('companyId', AppMain.companyId);
                    helper.post('/admin/linea-tiempo/store', formData)
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTemplate')).hide();
                        e.target.reset();
                        self.onListService();
                        sweet2.success({text: rsp.message});
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                    console.log(e);
                },
                onListService: () => {
                    self.loadList = false;
                    helper.post('/admin/linea-tiempo/' + id + '/childrens')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.templates = rsp.data.templates;
                        self.template = rsp.data.template;
                        KTMenu.updateDropdowns();
                        self.loadList = true;
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                filteredItems: function (data) {
                    return data.filter(function(val, index) {
                        let item = "";
                        if (val.name != undefined) {
                            item = val.name;
                        }
                        item = item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        return item.indexOf(self.search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())!== -1;
                    });
                },
                onRemove: (id) => {
                    sweet2.question({
                        title: '¿Estás seguro de eliminar este elemento?',
                        onOk: () => {
                            sweet2.loading();
                            const formData = new FormData();
                            formData.append('companyId', AppMain.companyId);
                            helper.post('/admin/plantillas/' + id + '/remove', formData)
                            .then(function (rsp) {
                                if (!rsp.success) {
                                    throw rsp.message;
                                }
                                self.onListService();
                                sweet2.success({text: rsp.message});
                            })
                            .catch(function (err) {
                                sweet2.error({html: err});
                            });
                        }
                    });
                },
                onFormDuplicate: (id) => {
                    self.fileId = id;
                    let fileName = '';
                    for (let i = 0; i < self.templates.length; i++) {
                        if (self.templates[i].id == id) {
                            fileName = self.templates[i].name;
                            // fileName = fileName.substring(0, fileName.lastIndexOf('.'));
                            break;
                        }                
                    }
                    // document.querySelector('#nameForm').value = fileName + ' ('+ (new Date).getTime() +')';
                    document.querySelector('#nameForm').value = (new Date).getTime() + '-' + fileName;
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFileDuplicate')).show();
                },
                onDuplicate: (e) => { 
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('companyId', AppMain.companyId);
                    helper.post('/admin/plantillas/' + self.fileId + '/duplicate', formData)
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.onListService();
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFileDuplicate')).hide();
                        e.target.reset();
                        sweet2.success({text: rsp.message});
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onViewerFile: function (item) {
                    console.log(item);
                    const myWindow = window.open(item.web_url, '', "width=1200,height=800,toolbar=0");
                    myWindow.focus();
                },
                onRemoveFolder: () => {
                    sweet2.question({
                        title: '¿Estás seguro de eliminar este elemento?',
                        onOk: () => {
                            sweet2.loading();
                            const formData = new FormData();
                            formData.append('companyId', AppMain.companyId);
                            helper.post('/admin/plantillas/' + id + '/remove', formData)
                            .then(function (rsp) {
                                if (!rsp.success) {
                                    throw rsp.message;
                                }
                                sweet2.success({text: rsp.message});
                                setTimeout(() => {
                                    sweet2.loading();
                                    location.href = '/admin/linea-tiempo';
                                }, 2000);
                            })
                            .catch(function (err) {
                                sweet2.error({html: err});
                            });
                        }
                    });
                },
                onViewerFile: function (item) {
                    const myWindow = window.open(item.web_url, '', "width=1200,height=800,toolbar=0");
                    myWindow.focus();
                },
            }
        });
    },
    init: () => {
        const indexContainer = 'AppTimeLineAdmin', showContainer = 'AppTimeLineShowAdmin';
        if (document.getElementById(indexContainer)) {
            AppTimeLineAdmin.index(indexContainer);
        }
        if (document.getElementById(showContainer)) {
            const id = document.getElementById(showContainer).getAttribute('data-id');
            AppTimeLineAdmin.show(showContainer, id);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AppTimeLineAdmin.init();
});