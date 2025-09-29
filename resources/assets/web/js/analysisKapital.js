const AppAnalysisKapitalWeb = () => {
    const index = function ({scope, uid}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    developed: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    emergent: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    company: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    sector: { cppc: 0, kd: 0, ke: 0, koa: 0 },
                    template: {},
                    typeId: 1,
                    title: 'Resultados generales',
                    loading: true,
                    currency: 'usd',
                    cppc: 0, kd: 0, ke: 0, koa: 0, dc: 0, kd2: 0,
                    relation: 0,
                    costdebt: 0,
                    currency2: 'Soles'
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
                    helper.post('/kapital/' + uid + '/analisis/detail')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.template = data.template;
                        self.company  = data.param.company;
                        self.sector   = data.param.sector;
                        self.costdebt = self.formatterx100p(data.param.costdebt);
                        self.relation = data.param.relation;
                        self.typeId = self.template.type_id;
                        self.currency2 = data.param.currency;
                        self.currency = data.param.currency == 'Soles' ? 'pen' : 'usd';
                        if (self.typeId == 1) {
                            self.kd2 = data.param.skd;
                            document.getElementById('currencyAnalysisInput').value = 'Dólares';
                            self.currency2 = 'Dólares';
                        } else {
                            self.kd2 = data.param.kd;
                        }
                        setTimeout(() => {
                            self.onModule();
                            self.loading = false;
                        }, 200);
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                },
                formatterx100p: (num) => {
                    return num + '%';
                },
                onCurrency: () =>{
                    self.onCurrencyCompany();
                },
                onCurrencyCompany: () => {
                    self.cppc = self.company.pen.cppc; 
                    self.kd   = self.company.pen.kd; 
                    self.ke   = self.company.pen.ke;
                    self.koa  = self.company.pen.koa;
                    self.dc   = self.company.pen.dc;
                    self.dc   = self.company.dc;
                    if (self.currency == 'usd') {
                        self.cppc = self.company.usd.cppc; 
                        self.kd   = self.company.usd.kd; 
                        self.ke   = self.company.usd.ke;
                        self.koa  = self.company.usd.koa;
                    }
                    bsGraph.square('bsGroupCard1', {
                        q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(self.koa)}`, value: self.koa },
                        q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(self.kd)}`, value: self.kd },
                        q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(self.ke)}`, value: self.ke }
                    });
                },
                onModule: () => {
                    if (self.typeId == 2) {
                        self.onCurrencyCompany();
                    } else {
                        self.dc   = self.sector.dc; 
                        self.cppc = self.sector.cppc; 
                        self.kd   = self.sector.kd; 
                        self.ke   = self.sector.ke;
                        self.koa  = self.sector.koa;
                        bsGraph.square('bsGroupCard1', {
                            q1: { title: 'Activo', text: `Koa = ${self.formatterx100p(self.koa)}`, value: self.koa },
                            q2: { title: 'Pasivo', text: `Kd(1-T) = ${self.formatterx100p(self.kd)}`, value: self.kd },
                            q3: { title: 'Patrimonio', text: `Ke = ${self.formatterx100p(self.ke)}`, value: self.ke }
                        });
                    }
                },
                onFormSector: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    formData.append('typeId', self.typeId);
                    helper.post('/kapital/' + uid + '/analisis/costos', formData)
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        setTimeout(() => {
                            sweet2.success({text: message});
                            window.AppFinanceWeb.modules.forEach(module => {
                                module.$mount();
                            });
                        }, 2500);
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                }
            }
        });
    },
    init = () => {
        const indexScope = 'AppAnalysisKapitalWeb';
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

document.addEventListener('DOMContentLoaded', AppAnalysisKapitalWeb());