/**
 * Receives a query object as parameter and sends it as Ajax request to the POST /query REST endpoint.
 *
 * @param query The query object
 * @returns {Promise} Promise that must be fulfilled if the Ajax request is successful and be rejected otherwise.
 */
CampusExplorer.sendQuery = function(query) {
    return new Promise(function(fulfill, reject) {
        // TODO: implement!
        // console.log("CampusExplorer.sendQuery not implemented yet.");
        var xhr = new XMLHttpRequest();
        xhr.open("POST",'http://localhost:4321/query', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            console.log('status code' + xhr.status);
            console.log('response' + xhr.response);
            if (xhr.response.status === "200") {
                var result = JSON.parse(xhr.responseText);
                fulfill(result);
            }
            if (xhr.response.status === "400") {
                reject("Ajax request error");
            }
        };
        xhr.send(JSON.stringify(query));
    });
};
