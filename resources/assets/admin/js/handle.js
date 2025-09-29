
function _authCMS() {
    sweet2.loading();
    const formData = new FormData();
    formData.append('userId', window.AppFinanceAdmin.userId);
    fetch(window.AppFinanceAdmin.api + "/api/auth/authcms", {method: "POST", body: formData})
    .then(function(res){ return res.json(); })
    .then(function(rsp){
        if (!rsp.success){
            throw rsp.message;
        }
        const { name, lastname, email, password, profile_id } = rsp.data;
        const url = window.AppFinanceAdmin.margarita + '/api/v1/authcms';
        
        $('<form>', {
            id: 'frmAuthCMS',
            html: ` <input type="hidden" name="name" value="${name}">
                    <input type="hidden" name="lastname" value="${lastname}">
                    <input type="hidden" name="email" value="${email}">
                    <input type="hidden" name="password" value="${password}">
                    <input type="hidden" name="profile_id" value="${profile_id}">`,
            action: url,
            target: '_blank',
            method: 'post',
            class:'add-none'
        }).appendTo(document.body).submit();
        $('#frmAuthCMS').remove();

        sweet2.loading(false);
        console.log(rsp);
    })
    .catch(function (err) {
        console.error(err);
        sweet2.error({html: err});
    });
}

