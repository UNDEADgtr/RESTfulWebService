//Service


var Service = {
//    findAll: function () {
//        $.ajax({
//            type: 'GET',
//            url: rootURL,
//            dataType: "json", // data type of response
//            success: renderList
//        });
//    },
//    findByName: function (searchKey) {
//        $.ajax({
//            type: 'GET',
//            url: rootURL + '/search/' + searchKey,
//            dataType: "json",
//            success: renderList
//        });
//    },
//    findById: function (id) {
//        $.ajax({
//            type: 'GET',
//            url: rootURL + '/' + id,
//            dataType: "json",
//            success: function (data) {
//                $('#btnDelete').show();
//                renderDetails(data);
//            }
//        });
//    },
    add: function (rootURL, data) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: rootURL,
            dataType: "json",
            data: data,
            success: function (data, textStatus, jqXHR) {
                alert('Created successfully');
                $('#btnDelete').show();
                $('#Id').val(data.id);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('add error: ' + textStatus);
            }
        });
    },
    update: function () {
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: rootURL + '/' + $('#Id').val(),
            dataType: "json",
            data: formToJSON(),
            success: function (data, textStatus, jqXHR) {
                alert('Updated successfully');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('update error: ' + textStatus);
            }
        });
    },
    delete: function () {
        console.log('delete');
        $.ajax({
            type: 'DELETE',
            url: rootURL + '/' + $('#Id').val(),
            success: function (data, textStatus, jqXHR) {
                alert('Deleted successfully');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('delete error');
            }
        });
    }
}