const AppAccountAdmin = {
    plugins: {
        datatable: {
            list: (_callback) => {
                return $('#table-request').DataTable({
                    language: helper.datatable.language,
                    searching: true,
                    ordering: false,  
                    responsive: true,
                    "processing" : true,
                    "serverSide" : true,
                    "order" : [],
                    "retrieve": true,
                    "ajax": {
                       "url": '/admin/cuentas/pagination',
                       "method": "POST",
                       "dataType": "json",
                       "data": { "companyId": AppMain.companyId }
                    },
                    "fnDrawCallback": function(oSettings, json) {
                        _callback();
                    },
                    "columnDefs": [
                        {
                            "targets": 0,
                            "data": "id",
                            "render": function ( data, type, row, meta ) {
                                return row.id;
                            }
                        },
                        {
                            "targets": 1,
                            "data": "name",
                            "render": function ( data, type, row, meta ) {
                                return row.name;
                            }
                        },
                        {
                            "targets": 2,
                            "data": "typeName",
                            "render": function ( data, type, row, meta ) {
                                return row.typeName;
                            }
                        },
                        {
                            "targets": 3,
                            "data": "typeName",
                            "render": function ( data, type, row, meta ) {
                                return row.status == 1 ? 'Activado' : 'Desactivado';
                            }
                        },
                        {
                            "targets": 4,
                            "data": "createdAt",
                            "render": function ( data, type, row, meta ) {
                                return row.createdAt;
                            }
                        },
                        {
                            "targets": 5,
                            "data": "id",
                            "className": "text-center",
                            "render": function ( data, type, row, meta ) {
                                return  `
                                <button type="button" class="btn btn-sm btn-light btn-active-light me-2 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Acción
                                </button>
                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4 dropdown-menu dropdown-menu-start">
                                    <!--div class="menu-item px-3">
                                        <a href="javascript:void(0);" class="menu-link px-3 btn-edit" data-id="${row.id}">Editar</a>
                                    </div-->
                                    <div class="menu-item px-3">
                                        <a href="javascript:void(0);" class="menu-link text-danger px-3 btn-remove" data-id="${row.id}">Eliminar</a>
                                    </div>
                                </div>`;
                            }
                        }
                    ]
                });
            }
        }
    },
    index: (container) => {
        let self = {};
        const { plugins: {datatable} } = AppAccountAdmin;
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    user: {},
                    dataTable: {}
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
                initialize: () => {
                   self.dataTable = datatable.list(()=>{self.onActionRows()});
                },
                onAuthUrlOnedrive: (e) => {
                    e.target.innerText  = 'Procesando';
                    e.target.disabled = true;
                    $('<form>', {
                        id: 'frmAzure',
                        html: ` <input type="text" name="userId" value="${ window.AppMain.userId }"/>
                                <input type="text" name="companyId" value="${ window.AppMain.companyId }"/>
                                <input type="text" name="redirect" value="${ (window.location.protocol + "//" + window.location.host + '/admin/cuentas') }" />`,
                        action: window.AppMain.baseurl + '/microsoft/onedrive/authUrl',
                        // target: '_blank',
                        method: 'post',
                        class:'add-none'
                    }).appendTo(document.body).submit();
                    $('#frmAzure').remove();
                    /*const formData = new FormData();
                    formData.append('userId', AppMain.userId);
                    formData.append('companyId', AppMain.companyId);
                    formData.append('redirect', window.location.protocol + "//" + window.location.host + '/admin/cuentas');
                    window.helper.post(window.AppMain.baseurl + '/microsoft/onedrive/authUrl', formData)
                    .then(({ success, data, message }) => {
                        if (!success) {
                            throw message;
                        }
                        location.href = data.url;
                    })
                    .catch(error => {
                        sweet2.error({text: error}); 
                        e.target.innerText  = 'Vincular';
                        e.target.disabled = false; 
                    });*/
                },
                onActionRows: () => {
                    const btnEdits = document.querySelector('#' + container).querySelectorAll('.btn-edit'),
                          btnRemoves = document.querySelector('#' + container).querySelectorAll('.btn-remove');
                    /*btnEdits.forEach(btn => {
                        btn.addEventListener('click', async function (e) {
                            try {
                                sweet2.loading();
                                const id = e.target.getAttribute('data-id');
                                const { user } = await self.getUser(id);
                                self.user = user;
                                console.log(self.user);                            
                                sweet2.loading(false);
                                bootstrap.Modal.getOrCreateInstance(document.getElementById('modalUpdateUser')).show();                        
                            } catch (error) {
                                sweet2.error({text: error});                                
                            }
                        });
                    });*/
                    btnRemoves.forEach(btn => {
                        btn.addEventListener('click', function (e) {
                            sweet2.question({
                                title: '¿Estás seguro de eliminar este elemento?',
                                onOk: () => {
                                    const id = e.target.getAttribute('data-id');
                                    self.onDelete(id);
                                }
                            });
                        });
                    });
                },
                onSearchTable: ({target}) => {
                    self.dataTable.search(target.value).draw();
                },
                onCreate: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('companyId', AppMain.companyId);
                    formData.append('userId', AppMain.userId);
                    window.helper.post('/admin/cuentas/store', formData)
                    .then(rsp => {
                        const { success, message } = rsp;
                        if (!success) {
                            throw message;
                        }
                        sweet2.success({text: message});  
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCreate')).hide();
                        e.target.reset();
                        self.dataTable.ajax.reload(null, false);
                    })
                    .catch(error => {
                        sweet2.error({text: error});  
                    });	
                },
                onDelete: (id) => {
                    sweet2.loading();
                    const formData = new FormData();
                    window.helper.post('/admin/cuentas/' + id + '/remove', formData)
                    .then(({ success, message }) => {
                        if (!success) {
                            throw message;
                        }
                        sweet2.success({text: message});  
                        self.dataTable.ajax.reload(null, false);
                    })
                    .catch(error => {
                        sweet2.error({text: error});  
                    });	
                },
            }
        });
    },
    init: () => {
        const indexContainer = 'AppIndexAccountAdmin';
        if (document.getElementById(indexContainer)) {
            AppAccountAdmin.index(indexContainer);
        }
    }
};

document.addEventListener('DOMContentLoaded', AppAccountAdmin.init());