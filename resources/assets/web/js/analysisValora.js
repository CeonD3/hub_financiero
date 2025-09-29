const AppAnalysisValoraWeb = () => {
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
                    general: {}
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
                    helper.post('/valora/' + uid + '/analysis/detail')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.integrated = data.param.integrated;
                        self.concept = data.param.concept;
                        self.general = data.param.general;
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
                onModule: (index) => {
                    if (index == 1) {
                        self.table = self.generales;
                    } else if (index == 2) {
                        self.table = self.resultados;
                    }
                },
                onGraph: ({concept, integrated}) => {
                    bsGraph.square3('bsGroup1', {
                        q1: { title: 'Activo', text: concept.balance.activeText , value: concept.balance.active },
                        q2: { title: 'Pasivo', text: concept.balance.passiveText , value: concept.balance.passive },
                        q3: { title: 'Patrimonio', text: concept.balance.patrimonyText , value: concept.balance.patrimony},
                        q4: { title: 'Valor Esperado', text: concept?.financialText , value: concept?.financial},
                        q5: { title: 'Valor Sensibilizado', text: concept?.sensitizedText , value: concept?.sensitized}
                    });
                    bsGraph.square3('bsGroup2', {
                        q1: { title: 'Activo', text: integrated.balance.activeText , value: integrated.balance.active },
                        q2: { title: 'Pasivo', text: integrated.balance.passiveText , value: integrated.balance.passive },
                        q3: { title: 'Patrimonio', text: integrated.balance.patrimonyText , value: integrated.balance.patrimony},
                        q4: { title: 'Valor Esperado', text: integrated?.financialText , value: integrated?.financial},
                        q5: { title: 'Valor Sensibilizado', text: integrated?.sensitizedText , value: integrated?.sensitized}
                    });
                },
                formatterx100p: (num) => {
                    return num + '%';
                },
                onFormAnalysisValora: (e) => {
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    helper.post('/valora/' + uid + '/analysis/cost', formData)
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        setTimeout(() => {
                            self.initialize();                        
                            sweet2.success({text: message});
                        }, 2500);
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                }
            }
        });
    },
    init = () => {
        const indexScope = 'AppAnalysisValoraWeb';
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

document.addEventListener('DOMContentLoaded', AppAnalysisValoraWeb());