const AppDesignAdmin = {
    form: function ({container}) {
        let self = null;
        new Vue({
            el: '#' + container,
            data() {
                return {
                    design: {}, //Object.create(args.design)
                }
            },
            created: function() {
                self = this;
            },
            mounted: function () {
                self.onLoad();
            },
            watch: {
            },
            methods: {
                onFormData: function (e) {  
                    e.preventDefault();
                    let formData = new FormData(e.currentTarget);
                    sweet2.question({
                        text: '¿Estás seguro de guardar cambios?',
                        onOk: function () {
                            sweet2.loading();
                            // fetch("/admin/report/save", {method: "POST", body: formData})
                            fetch(window.AppFinanceAdmin.api + "/api/admin/reports/save", {method: "POST", body: formData})
                            .then(function(res){ return res.json(); })
                            .then(function({success, data, message}){
                                if (!success) {
                                    throw message;
                                }
                                sweet2.show({
                                    text: message,
                                    type: 'success',
                                    onOk: function () {
                                        sweet2.loading({text: 'Actualizando...'});
                                        location.href = data.reload;
                                    }
                                });
                            })
                            .catch(function (err) {
                                console.error(err);
                                sweet2.error({text: err});
                            });
                        }
                    });
                },
                onLoad:function () {
                    this.onSummernote();
                    this.onEvent();
                },
                onEvent: function(params) {
                    $('#img-file').on('change', function (e) {
                    });
                },
                onSummernote: function () {
                    let oSummernote = {
                        fontSizes: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '20','24', '26', '28', '32'],
                        height: 600,
                        popover: {
                            image: [],
                            link: [],
                            air: []
                        },
                        tabsize: 2,
                        toolbar: [
                            ['style', ['style']],
                            ['font-style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                            ['font', ['fontname']],
                            ['font-size',['fontsize']],
                            ['font-color', ['color']],
                            ['para', ['ul', 'ol', 'paragraph']],
                            ['table', ['table']],
                            ['insert', ['link', 'picture', 'hr']],
                            ['misc', ['fullscreen', 'codeview', 'help']]
                        ]
                    };
                    $('#body_summernote').summernote(oSummernote);
                }
            }
        });
    },
    list: function () {
        $('.btn-delete').off('click');
        $('.btn-delete').on('click', function(){
            console.log('12');
            let id = $(this).attr('data-id');
            let formData = new FormData();
            formData.append('id', id);
            sweet2.question({
                html:'¿Estás seguro de eliminar este elemento?',
                onOk:function(){
                    sweet2.loading();
                    fetch(window.AppFinanceAdmin.api +"/api/admin/reports/remove", {method: "POST", body: formData})
                    .then(function(res){ return res.json(); })
                    .then(function({success, data, message}){ 
                        if (!success){
                            throw message;
                        }
                        sweet2.show({
                            type: 'success', 
                            html: message,
                            onOk: function () {
                                sweet2.loading();
                                location.reload();
                            }
                        });
                    })
                    .catch(function (err) {
                        sweet2.error({text: err});
                    });
                }
            });
        });
    },
    init: function () {
        const container1 = 'AppListDesignAdmin';
        if (document.getElementById(container1)) {
            AppDesignAdmin.list();
        }
        const container2 = 'AppFormDesignAdmin';
        if (document.getElementById(container2)) {
            AppDesignAdmin.form({container: container2});
        }
    }
}

document.addEventListener('DOMContentLoaded', AppDesignAdmin.init());

