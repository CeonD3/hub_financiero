const AppUserAdmin = {
    plugins: {
        datatable: {
            users: (_callback) => {
                return $('#users-table-request').DataTable({
                    language: helper.datatable.language,
                    searching: true,
                    ordering: false,  
                    responsive: true,
                    "processing" : true,
                    "serverSide" : true,
                    "order" : [],
                    "retrieve": true,
                    "ajax": {
                       "url": '/admin/usuarios/pagination',
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
                            "data": "fullname",
                            "render": function ( data, type, row, meta ) {
                                return row.fullname;
                            }
                        },
                        {
                            "targets": 2,
                            "data": "email",
                            "render": function ( data, type, row, meta ) {
                                return row.email;
                            }
                        },
                        {
                            "targets": 3,
                            "data": "profile_name",
                            "render": function ( data, type, row, meta ) {
                                return row.profile_name;
                            }
                        },
                        {
                            "targets": 4,
                            "data": "id",
                            "className": "text-center",
                            "render": function ( data, type, row, meta ) {
                                return  `
                                <button type="button" class="btn btn-sm btn-light btn-active-light me-2 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Acción
                                </button>
                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4 dropdown-menu dropdown-menu-start">
                                    <div class="menu-item px-3">
                                        <a href="javascript:void(0);" class="menu-link px-3 btn-edit" data-id="${row.id}">Editar</a>
                                    </div>
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
        const { plugins: {datatable} } = AppUserAdmin;
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    user: {},
                    userTable: {}
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
                   self.userTable = datatable.users(()=>{self.onActionRows()});
                },
                onActionRows: () => {
                    const btnEdits = document.querySelector('#' + container).querySelectorAll('.btn-edit'),
                          btnRemoves = document.querySelector('#' + container).querySelectorAll('.btn-remove');
                    btnEdits.forEach(btn => {
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
                    });
                    btnRemoves.forEach(btn => {
                        btn.addEventListener('click', function (e) {
                            sweet2.question({
                                title: '¿Estás seguro de eliminar este usuario?',
                                onOk: () => {
                                    const id = e.target.getAttribute('data-id');
                                    self.postDelete(id);
                                }
                            });
                        });
                    });
                },
                onSearchTable: ({target}) => {
                    self.userTable.search(target.value).draw();
                },
                onUpdate: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('companyId', AppMain.companyId);
                    window.helper.post('/admin/usuarios/' + self.user.id + '/update', formData)
                    .then(rsp => {
                        const { success, message } = rsp;
                        if (!success) {
                            throw message;
                        }
                        sweet2.success({text: message});  
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalUpdateUser')).hide();
                        e.target.reset();
                        self.userTable.ajax.reload(null, false);
                    })
                    .catch(error => {
                        sweet2.error({text: error});  
                    });
                },
                onCreate: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('companyId', AppMain.companyId);
                    window.helper.post('/admin/usuarios/store', formData)
                    .then(rsp => {
                        const { success, message } = rsp;
                        if (!success) {
                            throw message;
                        }
                        sweet2.success({text: message});  
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCreateUser')).hide();
                        e.target.reset();
                        self.userTable.ajax.reload(null, false);
                    })
                    .catch(error => {
                        sweet2.error({text: error});  
                    });	
                },
                getUser: async (id) => {
                    const formData = new FormData();
                    formData.append('companyId', AppMain.companyId);
                    return window.helper.post('/admin/usuarios/' + id + '/show', formData)
                    .then(rsp => {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        return rsp.data;
                    })
                    .catch(error => {
                        throw new Error(error);
                    });	
                },
                postDelete: (id) => {
                    sweet2.loading();
                    const formData = new FormData();
                    formData.append('companyId', AppMain.companyId);
                    window.helper.post('/admin/usuarios/' + id + '/remove', formData)
                    .then(rsp => {
                        const { success, message } = rsp;
                        if (!success) {
                            throw message;
                        }
                        sweet2.success({text: message});  
                        self.userTable.ajax.reload(null, false);
                    })
                    .catch(error => {
                        sweet2.error({text: error});  
                    });	
                },
            }
        });
    },
    init: () => {
        const indexContainer = 'AppIndexUserAdmin';
        if (document.getElementById(indexContainer)) {
            AppUserAdmin.index(indexContainer);
        }
    }
};

document.addEventListener('DOMContentLoaded', AppUserAdmin.init());