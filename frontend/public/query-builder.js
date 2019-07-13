/**
 * Builds a query object using the current document object model (DOM).
 * Must use the browser's global document object {@link https://developer.mozilla.org/en-US/docs/Web/API/Document}
 * to read DOM information.
 *
 * @returns query object adhering to the query EBNF
 */
CampusExplorer.buildQuery = function() {
    var dataset = document.getElementsByClassName("tab-panel active")[0].getAttribute("data-type");
    var query = {};
    var and = document.getElementById(dataset + "-conditiontype-all").getAttribute("checked");
    var or = document.getElementById(dataset + "-conditiontype-any").getAttribute("checked");
    var not = document.getElementById(dataset + "-conditiontype-none").getAttribute("checked");  // if the condition is not check it will be null, otherwise checked
    var conditions = parseConditions(dataset);
    var columns = parseColumns(dataset);
    var order = parseOrder(dataset);
    var groups = parseGroups(dataset);
    var transformation = parseTransformations(dataset);
    query = formWhere(conditions, and, or, not);
    query = formOptions(query, columns);
    query = formOrder(query, order);
    query = formTransformation(query, groups, transformation);
    return query;
};

function parseConditions(dataset){
    var conditions = document.getElementsByClassName("tab-panel active")[0].getElementsByClassName("control-group condition");
    var conditionArray = [];
    for (var condition of conditions) {
        var control_Not = condition.getElementsByClassName("control not")[0].getElementsByTagName("input")[0].getAttribute("checked");
        var control_Fields = condition.getElementsByClassName("control fields")[0].getElementsByTagName("option");
        var control_Field = "";
        for (var field of control_Fields) {
            if (field.getAttribute("selected") === "selected") {
                control_Field = field.getAttribute("value");
            }
        }
        var control_Operators = condition.getElementsByClassName("control operators")[0].getElementsByTagName("option");
        var control_Operator = "";
        for (var operator of control_Operators) {
            if (operator.getAttribute("selected") === "selected") {
                control_Operator = operator.getAttribute("value");
            }
        }
        var control_Term = condition.getElementsByClassName("control term")[0].getElementsByTagName("input")[0].getAttribute("value");
        if (control_Operator === "GT"||control_Operator === "LT"||control_Operator === "EQ") {
            control_Term = Number.parseFloat(control_Term);
        }
        var singleCondition = {};
        var wholeFieldName = dataset+"_"+control_Field;
        if (control_Not === "checked") {
            singleCondition = {
                NOT: {
                    [control_Operator]:{
                        [wholeFieldName]: control_Term
                    }
                }
            };
        } else {
            singleCondition = {
                [control_Operator]: {
                    [wholeFieldName]: control_Term
                }
            }
        }
        conditionArray.push(singleCondition);
    }
    return conditionArray;
}

function formWhere(conditions, and, or, not) {
    var query = {};
    if (conditions.length === 0) {
        query["WHERE"] = {};
    }
    if (conditions.length === 1) {
        if (not === "checked"||not === "") {
            query["WHERE"] = {
                NOT: conditions[0]
            }
        } else {
            query["WHERE"] = conditions[0];
        }
    }
    if (conditions.length > 1) {
        if (and === "checked"||and === "") {
            query["WHERE"] = {
                AND: conditions
            }
        }
        if (or === "checked"||or === "") {
            query["WHERE"] = {
                OR: conditions
            }
        }
        if (not === "checked"||not === "") {
            query["WHERE"] = {
                NOT: {
                    OR: conditions
                }
            }
        }
    }
    return query;
}

function parseColumns(datasetName) {
    var resultCols = [];
    var columns = document.getElementsByClassName("tab-panel active")[0].getElementsByClassName("form-group columns")[0].getElementsByClassName("control-group")[0];
    var controlFields = columns.getElementsByClassName("control field");
    for (var field of controlFields) {
        var attribute = field.getElementsByTagName("input")[0];
        if (attribute.getAttribute("checked") === "checked") {
            resultCols.push(datasetName + "_" + attribute.getAttribute("value"));
        }
    }
    controlFields = columns.getElementsByClassName("control transformation");
    for (var field1 of controlFields) {
        var attribute1 = field1.getElementsByTagName("input")[0];
        if (attribute1.getAttribute("checked") === "checked") {
            resultCols.push(attribute1.getAttribute("value"));
        }
    }
    return resultCols;
}
function parseOrder(datasetName) {
    var resultOrder = {
        orderKey: [],
        order: "UP"
    };
    var order = document.getElementsByClassName("tab-panel active")[0].getElementsByClassName("form-group order")[0].getElementsByClassName("control-group")[0];
    var controlFields = order.getElementsByClassName("control order fields")[0].getElementsByTagName("option");
    for (var field of controlFields) {
        if (field.getAttribute("selected") === "selected") {
            if (field.getAttribute("class") === "transformation") {
                resultOrder.orderKey.push(field.getAttribute("value"));
            } else {
                resultOrder.orderKey.push(datasetName + "_" + field.getAttribute("value"));
            }
        }
    }
    var controlOrder = order.getElementsByClassName("control descending")[0].getElementsByTagName("input")[0].getAttribute("checked");
    if (controlOrder === "checked") {
        resultOrder.order = "DOWN";
    }
    return resultOrder;
}
function parseGroups(datasetName) {
    var resultGroups = [];
    var groups = document.getElementsByClassName("tab-panel active")[0].getElementsByClassName("form-group groups")[0].getElementsByClassName("control-group")[0];
    var controlFields = groups.getElementsByClassName("control field");
    for (var field of controlFields) {
        var attribute = field.getElementsByTagName("input")[0];
        if (attribute.getAttribute("checked") === "checked") {
            resultGroups.push(datasetName + "_" + attribute.getAttribute("value"));
        }
    }
    return resultGroups;
}
function parseTransformations(dataset){
    var transformations = document.getElementsByClassName("tab-panel active")[0].getElementsByClassName("control-group transformation");
    if (transformations == null) {
        console.log("empty transformations");
        return null;
    }
    var transformationArray = [];
    for (var transformation of transformations) {
        var control_term = transformation.getElementsByClassName("control term")[0].getElementsByTagName("input")[0].getAttribute("value");
        var control_operators = transformation.getElementsByClassName("control operators")[0].getElementsByTagName("option");
        var control_operator = "";
        for (var operator of control_operators) {
            if (operator.getAttribute("selected") === "selected") {
                control_operator = operator.getAttribute("value");
            }
        }
        var control_fields = transformation.getElementsByClassName("control fields")[0].getElementsByTagName("option");
        var control_field = "";
        for (var field of control_fields) {
            if (field.getAttribute("selected") === "selected") {
                control_field = dataset + "_" + field.getAttribute("value");
            }
        }
        var singleCondition = {
            [control_term]:{
                [control_operator]: control_field
            }
        };
        transformationArray.push(singleCondition);
    }
    return transformationArray;
}
function formOptions(query2, columns) {
    var query = query2;
    if (columns.length === 0) {
        return new Error("No Columns to show");
    }
    if (columns.length > 0) {
        query["OPTIONS"] = {
            COLUMNS: columns
        }
    }
    return query;
}

function formOrder(query2, order) {
    var query = query2;
    if (order.orderKey == null||order.orderKey.length === 0) {
        return query;
    } else {
        if (order.orderKey.length === 1 && order.order === "UP") {
            query.OPTIONS["ORDER"] = order.orderKey[0];
        } else {
            query.OPTIONS["ORDER"] = {
                dir: order.order,
                keys: order.orderKey
            }
        }
    }
    return query;
}

function formTransformation(query2, group, transformation) {
    var query = query2;
    if (group.length === 0 || transformation.length === 0) {
        return query;
    } else {
        query["TRANSFORMATIONS"] = {
            GROUP: group,
            APPLY: transformation
        }
    }
    return query;
}
