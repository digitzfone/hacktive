

function callApi(postData, callBack){

    $.ajax({
        url: 'http://localhost:7474/db/data/cypher',
        data: postData,
        params: { "userId" : 1},
        type: 'POST'
    })
        .done(function (returnData) {
            callBack(returnData)
        })
        .fail(function (xhr, status, error) {
            //error
        });

}