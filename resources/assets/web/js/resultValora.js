const AppResultValoraWeb = () => {
    const index = function ({scope, uid}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    template: {},
                    typeId: 1,
                    title: 'Resultados generales',


                    table: [],
                    generales: [],
                    resultados: [],
                    loading: true,
                    loadingBVL: true,

                    concept: {
                        action: 0,
                        company: 0,
                        patrimony: 0
                    }, 
                    integrated: {
                        action: 0,
                        company: 0,
                        patrimony: 0
                    },
                    companies: [],
                    company: []
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
                    self.onBVL();
                },
                onDetail: () => {
                    self.loading = true;
                    helper.post('/valora/' + uid + '/result/detail')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.integrated = data.param.integrated;
                        self.concept = data.param.concept;
                        self.onGraph({
                            integrated: self.integrated,
                            concept: self.concept,
                        });
                        self.loading = false;
                        
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onBVL: () => {
                    self.loadingBVL = true;
                    helper.post('/valora/bvl')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.companies = data.companies;
                        if (self.companies.length > 0) {
                            self.company = self.companies[0];
                        }
                        self.loadingBVL = false;
                        
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onCompany: ({target}) => {
                    const index = target.value;
                    self.company = self.companies[index];
                    console.log(index);
                },
                onModule: (index) => {
                    if (index == 1) {
                        self.table = self.generales;
                    } else if (index == 2) {
                        self.table = self.resultados;
                    }
                },
                onGraph: ({concept, integrated}) => {
                    bsGraph.square2('bsGroup1', {
                        q1: { title: 'Activo', text: concept?.balance.activeText , value: concept?.balance.active },
                        q2: { title: 'Pasivo', text: concept?.balance.passiveText , value: concept?.balance.passive },
                        q3: { title: 'Patrimonio', text: concept?.balance.patrimonyText , value: concept?.balance.patrimony},
                        q4: { title: 'Valor Financiero del Patrimonio', text: concept?.financialText , value: concept?.financial}
                    });
                    bsGraph.square2('bsGroup2', {
                        q1: { title: 'Activo', text: integrated?.balance.activeText , value: integrated?.balance.active },
                        q2: { title: 'Pasivo', text: integrated?.balance.passiveText , value: integrated?.balance.passive },
                        q3: { title: 'Patrimonio', text: integrated?.balance.patrimonyText , value: integrated?.balance.patrimony},
                        q4: { title: 'Valor Financiero del Patrimonio', text: integrated?.financialText , value: integrated?.financial}
                    });
                },
                formatterx100p: (num) => {
                    return num + '%';
                }
            }
        });
    },
    init = () => {
        const indexScope = 'AppResultValoraWeb';
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

document.addEventListener('DOMContentLoaded', AppResultValoraWeb());