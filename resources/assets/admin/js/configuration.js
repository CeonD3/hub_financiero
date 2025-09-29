const AppConfigurationAdmin = {
    index: function ({container}) {
        let self = null;
        return new Vue({
            el: '#' + container,
            data() {
                return {
                    design: {},
                    design_contents: []
                }
            },
            created: function() {
                self = this;
            },
            mounted: function () {
                self.onShow();
            },
            watch: {
            },
            methods: {
                onShow: function() {
                    sweet2.loading();
                    helper.post(window.AppFinanceAdmin.api + '/api/admin/configuration/show')
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        self.design_contents = data.design_contents;
                        sweet2.loading(false);
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                },
                onUpdate: function(e) { 
                    e.preventDefault();
                    sweet2.loading();
                    const formData = new FormData(e.target);
                    helper.post(window.AppFinanceAdmin.api + '/api/admin/configuration/update', formData)
                    .then(function ({success, data, message}) {
                        if (!success) {
                            throw message;
                        }
                        sweet2.success({text: message});
                    })
                    .catch(function (err) {
                        console.log(err);
                        sweet2.error({html: err});
                    });
                }
            }
        });
    },
    init: function () {
        const container = 'AppConfigurationAdmin';
        if (document.getElementById(container)) {
            AppConfigurationAdmin.index({container: container});
        }
    }
}

document.addEventListener('DOMContentLoaded', AppConfigurationAdmin.init());

