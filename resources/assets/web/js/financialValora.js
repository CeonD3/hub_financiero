const AppFinancialValora = () => {
    const index = function ({scope, uid}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    developed: {
                        cppc: 0,
                        kd: 0, 
                        ke: 0,
                        koa: 0 
                    },
                    emergent: {
                        cppc: 0,
                        kd: 0, 
                        ke: 0,
                        koa: 0 
                    },
                    company: {
                        cppc: 0,
                        kd: 0, 
                        ke: 0,
                        koa: 0 
                    },
                    template: {},
                    typeId: 1,
                    title: 'Resultados generales',


                    table: [],
                    generales: [],
                    resultados: [],
                    loading: true
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
                    self.onBalance();
                },
                onBalance: () => {
                    self.loading = true;
                    helper.post('/valora/' + uid + '/financieros/balance')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.generales = data.balance.generales;
                        self.resultados = data.balance.resultados;
                        self.table = self.generales;
                        self.loading = false;   
                        
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onModule: (index) => {
                    if (index == 1) {
                        self.table = self.generales;
                    } else if (index == 2) {
                        self.table = self.resultados;
                    }
                },


                onSectorDetail: () => {
                    self.title = 'Resultados generales';
                    bsGraph.group('bsGroup1', {
                        groups: [
                            [
                                { title: 'Activo', text: `Koa = ${self.emergent.koa}%`, value: self.emergent.koa, color: '#7B1FA2'},
                            ],
                            [
                                { title: 'Pasivo', text: `kd = ${self.emergent.kd}%`, value: self.emergent.kd, color: '#4CAF50'},
                                { title: 'Patrimonio', text: `ke = ${self.emergent.ke}%`, value: self.emergent.ke, color: '#03A9F4'},
                            ],
                        ]
                    });
                    bsGraph.group('bsGroup2', {
                        groups: [
                            [
                                { title: 'Activo', text: `Koa = ${self.developed.koa}%`, value: self.developed.koa, color: '#7B1FA2'},
                            ],
                            [
                                { title: 'Pasivo', text: `kd = ${self.developed.kd}%`, value: self.developed.kd, color: '#4CAF50'},
                                { title: 'Patrimonio', text: `ke = ${self.developed.ke}%`, value: self.developed.ke, color: '#03A9F4'},
                            ],
                        ]
                    });
                },
                onCompanyDetail: () => {
                    self.title = 'Resultados generales de la empresa';
                    bsGraph.group('bsGroupCard1', {
                        groups: [
                            [
                                { title: 'Activo', text: `Koa = ${self.emergent.koa}%`, value: self.emergent.koa, color: '#7B1FA2'},
                            ],
                            [
                                { title: 'Pasivo', text: `kd = ${self.emergent.kd}%`, value: self.emergent.kd, color: '#4CAF50'},
                                { title: 'Patrimonio', text: `ke = ${self.emergent.ke}%`, value: self.emergent.ke, color: '#03A9F4'},
                            ],
                        ]
                    });
                    bsGraph.group('bsGroupCard2', {
                        groups: [
                            [
                                { title: 'Activo', text: `Koa = ${self.developed.koa}%`, value: self.developed.koa, color: '#7B1FA2'},
                            ],
                            [
                                { title: 'Pasivo', text: `kd = ${self.developed.kd}%`, value: self.developed.kd, color: '#4CAF50'},
                                { title: 'Patrimonio', text: `ke = ${self.developed.ke}%`, value: self.developed.ke, color: '#03A9F4'},
                            ],
                        ]
                    });
                    bsGraph.group('bsGroupCard3', {
                        groups: [
                            [
                                { title: 'Activo', text: `Koa = ${self.developed.koa}%`, value: self.developed.koa, color: '#7B1FA2'},
                            ],
                            [
                                { title: 'Pasivo', text: `kd = ${self.developed.kd}%`, value: self.developed.kd, color: '#4CAF50'},
                                { title: 'Patrimonio', text: `ke = ${self.developed.ke}%`, value: self.developed.ke, color: '#03A9F4'},
                            ],
                        ]
                    });
                },
                formatterx100p: (num) => {
                    return num + '%';
                }
            }
        });
    },
    init = () => {
        const indexScope = 'AppFinancialValora';
        const indexContainer = document.getElementById(indexScope);
        if (indexContainer) {
            const uid = indexContainer.getAttribute('uid');
            indexContainer.removeAttribute('uid');
            const app = index({scope:indexScope, uid:uid});
            window.AppFinanceWeb.modules.push(app);
        }
    };
    init();
}

document.addEventListener('DOMContentLoaded', AppFinancialValora());