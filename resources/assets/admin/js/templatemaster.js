const AppAdminTemplate = {
    index: ({container}) => {
        let self = null;
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    templates: [],
                    template: Object.create({}),
                    index: -1,
                    request: Object.create({}),
                    status: false
                }
            },
            created: function() {
                self = this;
            },
            mounted: function () {
                self.onInit();
            },
            watch: {
            },
            computed: {
            },
            methods: {
                onInit: function() {
                    self.onList();
                },
                onList: function () {
                    sweet2.loading();
                    fetch(window.AppFinanceAdmin.api + "/api/admin/master/templates/list", {method: "GET"})
                    .then(function(res){ return res.json(); })
                    .then(function({success, data, message}){
                        if (!success) {
                            throw message; 
                        }
                        const templates = [];
                        for (let i = 0; i < data.templates.length; i++) {
                            const item = data.templates[i];
                            if (item.file) {
                                item.file = window.AppFinanceAdmin.api + '/template/master/' + item.file;
                            }
                            templates.push(item);
                        }
                        self.templates = templates;
                        sweet2.loading(false);
                    })
                    .catch(function (err) {
                        console.error(err);
                        sweet2.error({text: err});
                    });
                },
                buildStructure: function (item) {
                    let html = ``;
                    if (item.type !== 'text') {
                        html += `<div class="card mb-4 border border-secondary">
                                    <div class="card-body p-4 bg-white text-dark">
                                        <div class="mb-2">${item.name}</div>
                                        <div class="mb-2">${item.code !== undefined ? item.code : ''}</div>
                                        ${item.html}
                                    </div>
                                </div>`;
                    }
                    return html;
                },
                onSaveProcess: function () {
                    sweet2.question({
                        text: '¿Estás seguro de procesar los datos?',
                        onOk:function() {
                            sweet2.loading();
                            const formData = new FormData();
                            formData.append('structures', self.request.structures);
                            formData.append('eid', self.request.eid);
                            formData.append('file', self.request.file);
                            formData.append('id', self.request.id);
                            formData.append('name', self.request.name);
                            formData.append('status', self.request.status);
                            formData.append('version', self.request.version); 
                            fetch(window.AppFinanceAdmin.api + "/api/admin/master/templates/save-process", {method: "POST", body: formData })
                            .then(function(res){ return res.json(); })
                            .then(function({success, data, message}){
                                if (!success) {
                                    throw message;
                                }
                                self.request = Object.create({});
                                bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTemplateMaster')).hide();
                                sweet2.show({
                                    type: 'success',
                                    title: message,
                                    onOk: () => {
                                        sweet2.loading();
                                        window.location.reload();
                                    }
                                });
                            })
                            .catch(function (err) {
                                console.error(err);
                                sweet2.error({text: err});
                            });
                        }
                    });
                },
                onSave: function (e) {
                    e.preventDefault();
                    let formData = new FormData(e.currentTarget),
                    status = Number(formData.get('status'));
                    sweet2.question({
                        text: '¿Estás seguro de procesar los datos?',
                        onOk:function() {
                            sweet2.loading();
                            fetch(window.AppFinanceAdmin.api + "/api/admin/master/templates/save", {method: "POST", body: formData })
                            .then(function(res){ return res.json(); })
                            .then(function({success, data, message}){
                                if (!success) {
                                    throw message;
                                }
                                const {eliminados, existentes, nuevos} = data.merge_template_structures;
                                self.request = {
                                    structures: JSON.stringify(data.structures),
                                    file: data.template.file,
                                    id: data.template.id,
                                    name: data.template.name,
                                    status: data.template.status,
                                    version: data.template.version,
                                    eid: data.template.eid,
                                };

                                bootstrap.Modal.getOrCreateInstance(document.getElementById('mdlForm')).hide(); 
                                document.getElementById("frmSave").reset();
                                
                                let html = ``;

                                html += `<div class="alert alert-success" role="alert">
                                                <h4 class="alert-heading">Códigos Nuevos!</h4>
                                                <p>Los elementos de está sección se agregarán en la lista de la edición de los reportes.</p>
                                                <hr>`;
                                if (nuevos && nuevos.length > 0) {
                                    nuevos.map(ee =>{
                                        html += self.buildStructure(ee);
                                    })   
                                } else {
                                    html += `No hay registros para mostrar.`;
                                }
                                html += `</div>`;

                                
                                html += `<div class="alert alert-danger" role="alert">
                                                <h4 class="alert-heading">Códigos Eliminados!</h4>
                                                <p>Los elementos de está sección serán eliminados de la lista de la edición de los reportes.</p>
                                                <hr>`;
                                if (eliminados && eliminados.length > 0) {
                                    eliminados.map(ee =>{
                                        html += self.buildStructure(ee);
                                    })   
                                } else {
                                    html += `No hay registros para mostrar.`;
                                }
                                html += `</div>`;
                                

                                html += `<div class="alert alert-primary" role="alert">
                                                <h4 class="alert-heading">Códigos Existentes!</h4>
                                                <p>Los elementos de está sección permanecerán en la lista de la edición de los reportes.</p>
                                                <hr>`;
                                if (existentes && existentes.length > 0) {
                                    existentes.map(ee =>{
                                        html += self.buildStructure(ee);
                                    })   
                                } else {
                                    html += `No hay registros para mostrar.`;
                                }
                                html += `</div>`;

                                const containerResponses = document.querySelectorAll('.container-response');
                                if (containerResponses && containerResponses.length > 0) {
                                    containerResponses.forEach(element => {
                                        element.innerHTML = html;
                                    });
                                }
                                
                                bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTemplateMaster')).show();
                                sweet2.loading(false);
                                /*sweet2.show({
                                    type: 'success', 
                                    text: message, 
                                    onOk: function () {
                                        // self.onList();
                                    }
                                })*/;
                            })
                            .catch(function (err) {
                                console.error(err);
                                sweet2.error({text: err});
                            });
                        }
                    });
                },
                onForm:function (index) {
                    document.getElementById("frmSave").reset();          
                    self.index = index;
                    if (index == -1) {
                        self.template = Object.create({});
                        self.status = false;
                    } else {
                        self.template = Object.create(self.templates[index]);
                        self.status = Number(self.template.status) === 1;                        
                    }
                    document.getElementById('lblFile').innerText = self.template.file ? self.template.file : 'Seleccionar Archivo';
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('mdlForm')).show();
                },
                onDelete: function (index) {
                    let id = self.templates[index].id;
                    sweet2.question({
                        text: '¿Estás seguro de eliminar esta plantilla?',
                        onOk:function() {
                            sweet2.loading();
                            const formData = new FormData();
                            formData.append('id', id);
                            fetch(window.AppFinanceAdmin.api + "/api/admin/master/templates/remove", {method: "POST", body: formData })
                            .then(function(res){ return res.json(); })
                            .then(function({success, data, message}){
                                if (!success) {
                                    throw message;
                                }
                                sweet2.show({
                                    type: 'success', 
                                    text: message, 
                                    onOk: function () {
                                        self.onList();
                                    }
                                });
                            })
                            .catch(function (err) {
                                console.error(err);
                                sweet2.error({text: err});
                            });
                        }
                    });
                },
                onReadFile: function (e) {
                    if (e.target.files.length > 0) {
                        document.getElementById('lblFile').innerText = e.target.files[0].name;
                    }
                }
            }
        });
    },
    init: () => {
        const container = 'AppAdminTemplate';
        if (document.getElementById(container)) {
            AppAdminTemplate.index({container: container});
        }
    }
  }
  document.addEventListener('DOMContentLoaded', AppAdminTemplate.init());