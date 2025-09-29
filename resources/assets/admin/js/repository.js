const AppFileAdmin = {
    index: (container) => {
        let self = {};
        const repositoryId = document.getElementById(container).getAttribute('data-id');
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    repositories: [],
                    accounts: [],
                    account: {},
                    users: [],
                    user: {},
                    meetings: [],
                    meeting: {},
                    recordings: [],
                    recording: {},
                    loading: false,
                    total: 0,
                    stacks: [],

                    typeId: 0,
                    storage: {},
                    storages: [],
                    folders: [],
                    breadcrumbs: [],
                    folderShow: false,
                    parent: {},

                    stacks: [],
                    loadingStacks: false,
                    typeIdStack: 1,
                    childrens: []
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
                    self.onAccounts();
                    self.onTranfers();
                    // self.onStacks();
                },
                onStacks: () => {
                    helper.post('/admin/repositorios/stacks')
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        console.log(data);
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                    });
                },
                onTranfers: () => {
                    self.loadingStacks = true;
                    const formData = new FormData();
                    formData.append('companyId', AppMain.companyId);
                    formData.append('userId', AppMain.userId);
                    helper.post('/admin/repositorios/' + repositoryId + '/transfers', formData)
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        self.stacks = data.stacks;
                        self.loadingStacks = false;
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                        self.loadingStacks = false;
                    });
                },
                onRemoveStack: (id)=> {
                    sweet2.question({
                        title: '¿Estás seguro de eliminar este elemento?',
                        onOk: () => {
                            sweet2.loading();
                            const formData = new FormData();
                            window.helper.post('/admin/repositorios/stacks/' + id + '/remove', formData)
                            .then(({ success, message }) => {
                                if (!success) {
                                    throw message;
                                }
                                sweet2.success({text: message});  
                                self.onTranfers();
                            })
                            .catch(error => {
                                sweet2.error({text: error});  
                            });	
                        }
                    });
                },
                onViewStack: (id)=> {
                    self.childrens = [];
                    sweet2.loading();
                    const formData = new FormData();
                    window.helper.post('/admin/repositorios/stacks/' + id + '/childrens', formData)
                    .then(({ success, data, message }) => {
                        if (!success) {
                            throw message;
                        }
                        self.childrens = data.childrens;
                        sweet2.loading(false); 
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalStackParent')).show();
                    })
                    .catch(error => {
                        sweet2.error({text: error});  
                    });
                    
                },
                onFormRepository: () => {
                    try {
                        if (Object.keys(self.parent).length == 0) {
                            throw 'Debe seleccionar el almacenamiento de destino';                            
                        }
                        let items = [];
                        const meetingIdChecks = document.getElementsByClassName('items');
                        meetingIdChecks.forEach((element, index) => {
                            if (element.checked) {
                                items = [
                                    ...items,
                                    element.value
                                ];
                            }
                        });
                        if (items.length == 0) {
                            throw 'Debe seleccionar un elemento';
                        }
                        sweet2.loading();
                        const formData = new FormData();
                        formData.append('accountIdSender', self.account?.id);
                        formData.append('userIdSender', self.user?.id);
                        formData.append('folderIdSender', self.meeting?.id);
                        formData.append('items', JSON.stringify(items));
                        formData.append('accountIdReceiver', self.parent.account.id);
                        formData.append('folderIdReceiver', self.parent?.folder?.id);
                        formData.append('nameFileReceiver', self.parent?.folder?.name);
                        formData.append('companyId', AppMain.companyId);
                        formData.append('userId', AppMain.userId);
                        formData.append('typeIdStack', self.typeIdStack);
                        helper.post('/admin/repositorios/' + repositoryId + '/transfer', formData)
                        .then(({success, data, message}) => {
                            if (!success) {
                                throw message;
                            }
                            console.log(data);
                            self.items = [];
                            meetingIdChecks.forEach((element, index) => {
                                if (element.checked) {
                                    element.checked = false;
                                }
                            });
                            self.onTranfers();
                            sweet2.success({text: message});
                        })
                        .catch(error => {
                            sweet2.error({text: error});
                        });                       
                    } catch (error) {
                        sweet2.error({text: error});
                    }
                },
                onTypeStack: (e) => {
                    self.typeIdStack = e.target.value;
                    self.onAccounts();
                },
                onFormStorage: (e) => {
                    e.preventDefault();
                    try {
                        const formData = new FormData(e.target);
                        const providerId = formData.get('providerId');
                        const folderId = formData.get('folderId');
                        if (!(providerId > 0)) {
                            throw 'Debe seleccionar una nube de almacenamiento';
                        }
                        if (!(self.storage?.id > 0)) {
                            throw 'Debe seleccionar una cuenta';
                        }
                        self.parent = {
                            repository: self.repositories.find(x => x.id == providerId),
                            account: self.storage,
                            folder: folderId ? self.folders.find(x=>x.id == folderId) : { id: '', name: 'raíz'}
                        };
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalParentFile')).hide();
                        sweet2.success({text: 'Se establecio el almacenamiento de destino'});
                     } catch (error) {
                        sweet2.error({text: error});
                    }
                },
                handleBreadcrumbs: (obj, type) => {
                    let breadcrumbs = [];
                    let band = true;
                    for (let i = 0; i < self.breadcrumbs.length; i++) {
                        const element = self.breadcrumbs[i];
                        breadcrumbs[i] = element; 
                        if (element.id == obj.id) {
                            band = false;
                            break;
                        }              
                    }
                    if (band) {
                        self.breadcrumbs = [
                            ...self.breadcrumbs,
                            {
                                id: obj.id,
                                name: obj.name,
                                type: type
                            }
                        ];
                    } else {
                        self.breadcrumbs = breadcrumbs;
                    }
                },
                onAccountsReceiver: (id) => {
                    sweet2.loading();
                    const formData = new FormData();
                    formData.append('companyId', AppMain.companyId);
                    formData.append('userId', AppMain.userId);
                    helper.post('/admin/repositorios/' + id + '/accounts', formData)
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        self.folderShow = false;
                        self.folders = [];
                        self.breadcrumbs = [];
                        self.storages = data.accounts;
                        sweet2.loading(false);
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                    });
                },
                onTypeAccount: ({target}) => {
                    self.typeId = target.value;
                    switch (Number(self.typeId)) {
                        case 3:
                            self.onAccountsReceiver(self.typeId);
                        break;
                        default:
                        break;
                    }
                },
                onChildrens: (id) => {
                    console.log(id);
                    // self.storage = self.storages.find(x => x.id == id);
                    self.storage = self.storages.length == 0 && self.storage?.id ? self.storage : self.storages.find(e => e.id == id);
                    self.onFolders();
                },
                onFolders: (id = "") => {
                    self.loading = true;
                    if (id.length > 0 && self.folders.length > 0) {
                        const folder = self.folders.find(x => x.id == id);
                        self.handleBreadcrumbs(folder, 2);
                    } else {
                        self.handleBreadcrumbs(self.storage, 1);
                    }
                    sweet2.loading();
                    const formData = new FormData();
                    formData.append('accountId', self.storage.id);
                    formData.append('id', id);
                    helper.post('/admin/onedrive/folders', formData)
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        self.folderShow = true;
                        self.storages = [];
                        self.folders = data.folders;
                        self.loading = false;
                        sweet2.loading(false);
                    })
                    .catch(error => {
                        self.loading = false;
                        sweet2.error({text: error});
                    });
                },
                onAccounts: () => {
                    self.breadcrumbs = [];
                    self.items = [];
                    self.loading = true;
                    const formData = new FormData();
                    formData.append('companyId', AppMain.companyId);
                    formData.append('userId', AppMain.userId);
                    helper.post('/admin/repositorios/' + repositoryId + '/accounts', formData)
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        self.clearAccounts(true);
                        self.clearUsers(true);
                        self.clearMeetings(true);
                        self.clearRecordings(true);
                        self.accounts = data.accounts;
                        self.repositories = data.repositories;
                        self.total = self.accounts.length;
                        self.loading = false;
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                        self.loading = false;
                    });
                },
                onUsers: (id) => {
                    if (Number(id) > 0) {
                        self.items = [];
                        self.loading = true;
                        self.account = self.accounts.length == 0 && self.account?.id ? self.account : self.accounts.find(e => e.id == id);
                        helper.post('/admin/zoom/' + id + '/users')
                        .then(({success, data, message}) => {
                            if (!success) {
                                throw message;
                            }
                            self.clearAccounts(false);
                            self.clearUsers(true);
                            self.clearMeetings(true);
                            self.clearRecordings(true);
                            self.users = data.users;
                            self.total = data.total_records;
                            self.loading = false;
                        })
                        .catch(error => {
                            sweet2.error({text: error});
                            self.loading = false;
                        });
                    }
                },
                onMeetings: (id) => {
                    self.items = [];
                    self.loading = true;
                    self.user = self.users.length == 0 && self.user?.id ? self.user : self.users.find(e => e.id == id);
                    helper.post('/admin/zoom/' + self.account.id + '/users/' + id + '/meetings')
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        self.clearUsers(false);
                        self.clearMeetings(true);
                        self.clearRecordings(true);
                        self.meetings = data.meetings;
                        self.total = data.total_records;
                        self.loading = false;
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                        self.loading = false;
                    });
                },
                onRecordings: (id) => {
                    self.items = [];
                    self.loading = true;
                    self.meeting = self.meetings.length == 0 && self.meeting?.id ? self.meeting : self.meetings.find(e => e.id == id);
                    helper.post('/admin/zoom/' + self.account.id + '/meetings/' + id + '/recordings')
                    .then(({success, data, message}) => {
                        if (!success) {
                            throw message;
                        }
                        self.clearMeetings(false);
                        self.clearRecordings(true);
                        self.recordings = data.recording_files;
                        self.total = data.recording_count;
                        self.loading = false;
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                        self.loading = false;
                    });
                },
                clearRecordings: (all = false) => {
                    self.recordings = [];
                    if (all) {
                        self.recording = {};
                    }
                }, 
                clearMeetings: (all = false) => {
                    self.meetings = [];
                    if (all) {
                        self.meeting = {};
                    }
                }, 
                clearUsers: (all = false) => {
                    self.users = [];
                    if (all) {
                        self.user = {};
                    }
                }, 
                clearAccounts: (all = false) => {
                    self.accounts = [];
                    if (all) {
                        self.account = {};
                    }
                }, 
            }
        });
    },
    init: () => {
        const indexContainer = 'AppIndexFileAdmin';
        if (document.getElementById(indexContainer)) {
            AppFileAdmin.index(indexContainer);
        }
    }
};

document.addEventListener('DOMContentLoaded', AppFileAdmin.init());