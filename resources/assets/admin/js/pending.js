const AppPendingAdmin = {
    index: function ({scope}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    periods_timelines: [],
                    periods_products: [],
                    period_selected: Object.create({}),
                    loadProducts: false,
                    loadPeriods: false
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
                    self.onPeriods();
                },
                onPeriods: () => {
                    self.loadPeriods = false;
                    helper.post('/admin/solicitudes/periodos')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.periods_timelines = rsp.data.periods_timelines;
                        self.loadPeriods = true;
                        if (self.periods_timelines?.length > 0) {
                            self.onProducts(0);
                        } else {
                            self.loadProducts = true;
                        }
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onProducts: function (index) {
                    self.loadProducts = false;
                    self.period_selected = self.periods_timelines[index];
                    var formData = new FormData();
                    formData.append('id', self.period_selected.id);
                    helper.post('/admin/solicitudes/productos', formData)
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.periods_products = rsp.data.periods_products;
                        self.loadProducts = true;
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                },
            }
        });
    },
    init: () => {
        AppPendingAdmin.index({scope: 'AppPendingAdmin'});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AppPendingAdmin.init();
});