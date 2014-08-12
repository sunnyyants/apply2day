/**
 * Created by Sunny on 8/8/14.
 */
$(document).ready(function(){
    var htmlText;
    $.getJSON('../../json/unitedStates.json',function(data){
        $.each(data, function(index, value){
            htmlText += "<option value=";
            htmlText += (index +'>' + value);
            htmlText += ("</option>")
        });
        $("#statesOptions").html(htmlText);
    });
});