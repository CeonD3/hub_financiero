const AppProfileAdmin = {
    profile: (container) => {
        let self = {};
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    user: {},
                    loadProfile: false
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
                    self.onDetail();                
                },
                onDetail: () => {
                    window.helper.post('/admin/usuarios/' + AppMain.userId + '/info')
                    .then(rsp => {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.user = rsp.data.user;
                        self.loadProfile = true;
                    })
                    .catch(error => {
                        sweet2.error({text: error});
                    });	
                }
            }
        });
    },
    account: (container) => {
        let self = {};
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    loadAccount: false,
                    account: {},
                    status: false
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
                    console.log('Account');
                    self.onAccount();
                },
                onAccount: () => {
                    window.helper.post('/admin/usuarios/' + AppMain.userId + '/microsoft')
                    .then(rsp => {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.account = rsp.data.account;
                        self.status = rsp.data.status;
                        self.loadAccount = true;
                    })
                    .catch(error => {
                        self.loadAccount = true;
                        sweet2.error({html: error});
                    });	
                },
                onToggleAccount: (e) => {
                    e.preventDefault();
                    const checked = e.target.checked;
                    if (checked) { // Active
                        sweet2.question({
                            title: '¿Estás seguro de vincular tu cuenta?',
                            onOk: () => {
                                sweet2.loading();
                                $('<form>', {
                                    id: 'frmAzure',
                                    html: ` <input type="text" name="userId" value="${ window.AppMain.userId }"/>
                                            <input type="text" name="redirect" value="${ (window.location.protocol + "//" + window.location.host + '/admin/perfil') }" />/>`,
                                    action: window.AppMain.baseurl + '/microsoft/authurl',
                                    // target: '_blank',
                                    method: 'post',
                                    class:'add-none'
                                }).appendTo(document.body).submit();
                                $('#frmAzure').remove();
                            },
                            onCancel: () => {
                                e.target.checked = !checked;
                            }
                        });
                    } else {
                        sweet2.question({
                            title: '¿Estás seguro de desvincular tu cuenta?',
                            text: 'Se descronizará todos los flujos de trabajo que has realizado relacionado con tu cuenta',
                            onOk: () => {
                                sweet2.loading();
                                const formData = new FormData();
                                formData.append('userId', AppMain.userId);
                                helper.post('/microsoft/signout', formData)
                                .then(rsp => {
                                    if (!rsp.success) {
                                        throw rsp.message;
                                    }
                                    sweet2.loading({text: rsp.message});
                                    setTimeout(() => {
                                        window.location.reload();                                        
                                    }, 2000);
                                })
                                .catch(error => {
                                    sweet2.error({html: error});
                                    e.target.checked = !checked;
                                });	
                            },
                            onCancel: () => {
                                e.target.checked = !checked;
                            }
                        });
                    }
                }
            }
        });
    },
    init: () => {
        const profileContainer = 'AppProfileDetailAdmin', accountContainer = 'AppAccountExternalAdmin';
        if (document.getElementById(profileContainer)) {
            AppProfileAdmin.profile(profileContainer);
        }
        // if (document.getElementById(accountContainer)) {
        //     AppProfileAdmin.account(accountContainer);
        // }
    }
};

document.addEventListener('DOMContentLoaded', AppProfileAdmin.init());