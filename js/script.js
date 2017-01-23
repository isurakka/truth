function cartesianProduct() {
    return _.reduce(arguments, function(a, b) {
        return _.flatten(_.map(a, function(x) {
            return _.map(b, function(y) {
                return x.concat([y]);
            });
        }), false);
    }, [ [] ]);
};

var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

$(document).ready(function() {
    var input_count_element = $("#input_count");
    var input_count_change = function() {
         var input_count = parseInt(input_count_element.val());
         var truth = $("#truth");
         truth.empty();
         truth.append("<tr>" + _.concat(
             _.range(0, input_count)
             .map(function(i) {
                 return '<th><input class="name" type="text" value="' + alphabet[i] + '" /></th>';
             }), ["<th>output</th>"]).join() + "</tr>");
         var cp = cartesianProduct(..._.range(0, input_count).map(function(n) { return [0, 1] }));
         truth.append(
             _.range(0, cp.length)
             .map(function(i) {
                     return '<tr class="combination">' + _.range(0, cp[i].length).map(function(j) {
                         return '<td>' + cp[i][j] + '</td>';
                     }).join() + '<td><input type="number" name="output_' + i + '" value="1" /></td>' + '</tr>';
             }).join());
    };
    input_count_change();
    input_count_element.change(input_count_change);

    $("#calculate").click(function() {
         var oneArray = _.filter($(".combination"), function(ele) { return parseInt($(ele).find('td').last().find('input').val()) === 1; })
            .map(function(ele) { return _.initial($(ele).find('td')).map(function(td) { return parseInt($(td).html()) }); });
            console.log(oneArray);
            var jsonData = JSON.stringify({
                names: _.map($(".name"), function(ele) { return $(ele).val(); }),
                input: oneArray });
            console.log(jsonData);

            $.ajax({
                url: "/calculate",
                type: "POST",
                data: jsonData,
                contentType:"application/json; charset=utf-8",
                accepts: "text/html",
                dataType:"json",
            }).done(function(data) {
                $("#result").html(data.output);
            }).fail(function(data) {
                $("#result").html(data.responseText);
            });
    });
});