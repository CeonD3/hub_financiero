var KTCustomersList = function() {
    var t, e, o, n, c = () => {
        console.log(n);
            n.querySelectorAll('[data-kt-customer-table-filter="delete_row"]').forEach((el => {
                el.addEventListener("click", (function(e) {
                    e.preventDefault();
                    const id = el.getAttribute('data-id'), index = el.getAttribute('data-index'), r = n.querySelector('[data-row-index="'+index+'"]');
                    sweet2.question({
                        title: 'Estás seguro de eliminar este proyecto',
                        onOk: () => {
                            sweet2.loading();
                            helper.post('/finance/projects/'+id+'/remove')
                            .then(({success, data, message}) => {
                                if (!success) {
                                    throw message;
                                }
                                t.row($(r)).remove().draw();
                                sweet2.success({text: message});
                            })
                            .catch((err) => {
                                sweet2.error({text: err});
                            });
                        }
                    });
                }))
            }))
        }
    return {
        init: function() {
            (n = document.querySelector("#kt_customers_table")) && n.querySelectorAll("tbody tr"), (t = $(n).DataTable({
                info: !1,
                order: [],
                columnDefs: [{
                    orderable: !1,
                    targets: 0
                }, {
                    orderable: !1,
                    //targets: 4
                }]
            })).on("draw", (function() {
                c()
            })), document.querySelector('[data-kt-customer-table-filter="search"]').addEventListener("keyup", (function(e) {
                t.search(e.target.value).draw()
            })), c()
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTCustomersList.init()
}));