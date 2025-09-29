const initLanding = () => {
    const moduleIndustry = function ({scope}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    industries: [],
                    years: [],
                    items: [],
                    year: '',
                    industry: '',
                    loading: true,
                    updown: true,
                    industrySelected: {
                        label: '[SELECCIONE]', value: '0'
                    }
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
                    self.onListIndustry();
                },
                onListIndustry: () => {
                    self.loading = true;
                    helper.post('/finance/industries')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.years = rsp.data.years;
                        self.industries = rsp.data.industries;
                        if (self.years?.length > 0) {
                            self.year = self.years[0].year;
                            self.items = self.years[0].industries;
                            self.onGraphIndustry({
                                data: self.items
                            })
                            .then(()=> {
                                self.loading = false;
                            });
                        } else {
                            self.loading = false;
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                },
                onUpdown: () => {
                    self.loading = true;
                    self.updown = !self.updown;
                    
                    self.onGraphIndustry({
                        data: self.items,
                        selected: self.industry
                    })
                    .then(()=> {
                        self.loading = false;
                    });
                },
                onYear: () => {
                    self.loading = true;
                    const year = self.years.find((o)=>{return o.year == self.year});
                    self.items = year.industries;
                    self.onGraphIndustry({
                        data: self.items,
                        selected: self.industry
                    })
                    .then(()=> {
                        self.loading = false;
                    });
                },
                onIndustry: () => {
                    self.loading = true;
                    self.industrySelected = self.items.find((o) => { return o.label == self.industry});
                    self.onGraphIndustry({
                        data: self.items,
                        selected: self.industry
                    })
                    .then(()=> {
                        self.loading = false;
                    });
                },
                onZoom: () => {
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalIndustry')).show();
                },
                onGraphIndustry: async ({data, selected}) => {
                    for (let i = 0; i < data.length; i++) {
                        data[i].value = Number(data[i].value);
                    }
                    if (self.updown) { // up
                        data.sort( (a, b) => {
                            if(a.value == b.value) {
                                return 0; 
                            }
                            if(a.value < b.value) {
                                return -1;
                            }
                            return 1;
                        });
                    } else {
                        data.sort( (a, b) => {
                            if(a.value == b.value) {
                                return 0; 
                            }
                            if(a.value > b.value) {
                                return -1;
                            }
                            return 1;
                        });
                    }
                    am4core.ready(function() {
                        AppAmchart4.onColumnAll({scope:'chartdiv', data:{industries: data}, selected: selected})
                        .then(() => {
                            return AppAmchart4.onColumnAll({scope:'chartdiv2', data:{industries: data}, selected: selected});
                        });
                    });
                },
            }
        });
    },
    init = () => {
        const indexScope = 'ModuleGraphIndustryWeb';
        const indexContainer = document.getElementById(indexScope);
        if (indexContainer) {
            moduleIndustry({scope:indexScope});
        }
    };
    init();
}
document.addEventListener('DOMContentLoaded', initLanding());