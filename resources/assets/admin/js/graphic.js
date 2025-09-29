const AppGraphicAdmin = {
    index: function ({scope, periodProductId}) {
        let self = {};
        return new Vue({
            el: '#' + scope,
            data() {
                return {
                    graphics: [],
                    templates: [],
                    grapichSelected: Object.create({}),
                    grapichsLoad: false,
                    templatesLoad: false,
                    templateProcess: false,
                    template: {}
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
                    self.onGraphics();
                },
                onGraphics: () => {
                    self.grapichsLoad = false;
                    helper.post('/admin/linea-grafica/list')
                    .then(function (rsp) {
                        if (!rsp.success) {
                            throw rsp.message;
                        }
                        self.graphics = rsp.data.graphics;
                        self.grapichsLoad = true;
                        if (self.graphics?.length > 0) {
                            self.onTemplates(0);
                        } else {
                            self.templatesLoad = true;
                        }
                    })
                    .catch(function (err) {
                        sweet2.error({html: err});
                    });
                },
                onTemplates: function (index) {
                    if (self.templateProcess) {
                        sweet2.error({html: 'Hay un proceso que se esta ejecutando'});
                        return;
                    }
                    self.templateProcess = true;
                    self.templatesLoad = false;
                    self.grapichSelected = self.graphics[index];

                    const mycarousel = $('#carousel-template');
                    if (mycarousel) {

                        mycarousel.owlCarousel('destroy');
                        mycarousel.html('');

                        mycarousel.owlCarousel({
                            loop: false,
                            margin: 30,
                            dots: false,
                            nav: true,
                            navText: [
                                `<span><i class="fa fa-chevron-left" aria-hidden="true"></i></span>`,
                                `<span><i class="fa fa-chevron-right" aria-hidden="true"></i></span>`
                            ],
                            // items: 5
                            responsive : {
                                // breakpoint from 0 up
                                0 : {
                                    items: 1
                                },
                                // breakpoint from 480 up
                                480 : {
                                    items: 2
                                },
                                // breakpoint from 768 up
                                768 : {
                                    items: 2
                                },
                                992 : {
                                    items: 3
                                },
                                1360 : {
                                    items: 4
                                }
                            }
                        });
                
                        mycarousel.on('click', '.owl-item>div', function (e) {
                            e.preventDefault();
                            self.template = {
                                id: e.target.getAttribute('data-id'),
                                url: e.target.getAttribute('data-url'),
                                thumbnailUrl: e.target.getAttribute('data-thumbnail-url')
                            };
                            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTemplateView')).show();
                        });

                        const formData = new FormData();
                        formData.append('userId', AppMain.userId);
                        formData.append('periodProductId', periodProductId);
                        helper.post('/admin/linea-grafica/' + self.grapichSelected.id + '/templates', formData)
                        .then(function (rsp) {
                            self.templatesLoad = true;
                            if (!rsp.success) {
                                throw rsp.message;
                            }
                            self.templates = rsp.data.templates;
                            if (self.templates.length > 0) {
                                for (let i = 0; i < self.templates.length; i++) {
                                    // const file = self.templates[i].file; 
                                    // if (Object.keys(file).length > 0){
                                    //     const content1 =  `<div class="my-2 card-template"><img data-id="${file.id}" data-url="${file.thumbnails[0].large.url}" src="${file.thumbnails[0].large.url}" width="100%"></div>`;
                                    //     mycarousel.owlCarousel().trigger('add.owl.carousel', [jQuery(content1)]).trigger('refresh.owl.carousel');
                                    // }
                                    const file = self.templates[i];
                                    const content1 =  `<div class="my-2 card-template"><img data-id="${file.id}" data-thumbnail-url="${encodeURI(file.thumbnail_large_url)}" data-url="${encodeURI(file.url)}" src="${file.thumbnail_medium_url}" width="100%"></div>`;
                                    mycarousel.owlCarousel().trigger('add.owl.carousel', [jQuery(content1)]).trigger('refresh.owl.carousel');
                                }
                            } else {
                                mycarousel.html('<div class="text-center">No hay registros para mostrar</div>');
                            }
                            self.templateProcess = false;
                        })
                        .catch(function (err) {
                            console.log(err);
                            self.templateProcess = false;
                            sweet2.error({html: err});
                        });
                    }
                },
                downloadImage: async function(imageSrc) {
                    const image = await fetch(imageSrc)
                    const imageBlog = await image.blob()
                    const imageURL = URL.createObjectURL(imageBlog)
                    const link = document.createElement('a')
                    link.href = imageURL;
                    link.download = (new Date()).getTime();
                    document.body.appendChild(link);
                    link.click()
                    document.body.removeChild(link);
                },
                onPusblish: function (state) {
                    const title = `¿Estás seguro de ${state == 1 ? 'publicar' : 'anular'} este producto?`;
                    sweet2.question({
                        title: title,
                        onOk: function() {
                            sweet2.loading();
                            const formData = new FormData();
                            formData.append('state', state);
                            helper.post(`/admin/solicitudes/periodo-producto/${periodProductId}/state`, formData)
                            .then(function ({
                                    success, 
                                    message
                                }) {
                                        if (!success) {
                                            throw message;
                                        }
                                        sweet2.success({html: message});
                                        let stylePublic = state == 1 ? 'none' : 'block', 
                                            styleCancel = state == 0 ? 'none' : 'block';
                                        document.getElementById('btnPublicProduct').style.display = stylePublic;
                                        document.getElementById('btnCancelProduct').style.display = styleCancel;
                            })
                            .catch(function (err) {
                                console.log(err);
                                sweet2.error({html: err});
                            });
                        }
                    });
                }
            }
        });
    },
    init: () => {
        const indexScope = 'AppGraphicAdmin';
        const indexContainer = document.getElementById(indexScope);
        if (indexContainer) {
            const periodProductId = indexContainer.getAttribute('data-id');
            indexContainer.removeAttribute('data-id');
            AppGraphicAdmin.index({scope:indexScope, periodProductId:periodProductId});
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AppGraphicAdmin.init();
});