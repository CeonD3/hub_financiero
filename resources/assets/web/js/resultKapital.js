const AppResultKapitalWeb = () => {
    const index = function ({scope, uid}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    developed: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    emergent: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    company: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    template: {},
                    typeId: 1,
                    title: 'Resultados generales',
                    loading: true,
                    currency: 'usd',
                    cppc: 0, kd: 0, ke: 0, koa: 0
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
                    self.onDetail();
                },
                onDetail: () => {
                    self.loading = true;
                    helper.post('/kapital/' + uid + '/result/detail')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.template = data.template;
                        self.emergent = data.param.emergent;
                        self.developed = data.param.developed;
                        self.company = data.param.company;
                        self.typeId = self.template.type_id;
                        self.currency = data.param.currency == 'Soles' ? 'pen' : 'usd';
                        setTimeout(() => {
                            if (self.typeId == 1) {
                                self.onSectorDetail();
                            } else {
                                self.onCompanyDetail();
                            }
                            self.loading = false;
                        }, 200);
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onSectorDetail: () => {
                    self.title = 'Resultados generales';
                    bsGraph.square('bsGroup1', {
                        q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(self.emergent.koa)}`, value: self.emergent.koa },
                        q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(self.emergent.kd)}`, value: self.emergent.kd },
                        q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(self.emergent.ke)}`, value: self.emergent.ke}
                    });
                    bsGraph.square('bsGroup2', {
                        q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(self.developed.koa)}`, value: self.developed.koa },
                        q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(self.developed.kd)}`, value: self.developed.kd },
                        q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(self.developed.ke)}`, value: self.developed.ke }
                    });
                },
                onCompanyDetail: () => {
                    self.title = 'Resultados generales de la empresa';
                    self.onCurrencyCompany();
                    bsGraph.square('bsGroupCard2', {
                        q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(self.developed.koa)}`, value: self.developed.koa },
                        q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(self.developed.kd)}`, value: self.developed.kd },
                        q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(self.developed.ke)}`, value: self.developed.ke }
                    });
                    bsGraph.square('bsGroupCard3', {
                        q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(self.emergent.koa)}`, value: self.emergent.koa },
                        q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(self.emergent.kd)}`, value: self.emergent.kd },
                        q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(self.emergent.ke)}`, value: self.emergent.ke }
                    });
                },
                formatterx100p: (num) => {
                    return num + '%';
                },
                onCurrency: () =>{
                    self.onCurrencyCompany();
                },
                onCurrencyCompany: () => {
                    let company = {
                        koa: self.company.pen.koa,
                        kd: self.company.pen.kd,
                        ke: self.company.pen.ke
                    };
                    self.cppc = self.company.pen.cppc; 
                    self.kd   = self.company.pen.kd; 
                    self.ke   = self.company.pen.ke;
                    self.koa  = self.company.pen.koa;
                    if (self.currency == 'usd') {
                        company = {
                            koa: self.company.usd.koa,
                            kd: self.company.usd.kd,
                            ke: self.company.usd.ke
                        };
                        self.cppc = self.company.usd.cppc; 
                        self.kd   = self.company.usd.kd; 
                        self.ke   = self.company.usd.ke;
                        self.koa  = self.company.usd.koa;
                    }
                    bsGraph.square('bsGroupCard1', {
                        q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(company.koa)}`, value: company.koa },
                        q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(company.kd)}`, value: company.kd },
                        q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(company.ke)}`, value: company.ke }
                    });
                }
            }
        });
    },
    init = () => {
        const indexScope = 'AppResultKapitalWeb';
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

document.addEventListener('DOMContentLoaded', AppResultKapitalWeb());