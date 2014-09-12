/**
 * Created by Sunny on 8/12/14.
 */
$(document).ready(function(){

    var colorStatus = function(status, statusText){
        if(statusText === "Phoned"){
            status.removeClass().addClass('text-warning');
        }else if(statusText === "Code-tested"){
            status.removeClass().addClass('text-info');
        }else if(statusText === "On-sited"){
            status.removeClass().addClass('text-primary');
        }else if(statusText === 'Declined'){
            status.removeClass().addClass('text-danger');
        }else if(statusText === 'Offered'){
            status.removeClass().addClass('text-success');
        }else{
            status.removeClass();
        }
    };

    var col = $('#list > :nth-child(8)');
    $.each(col,function(ind, res){
        var status = $(res);
        var statusText = $(res).text();
        colorStatus(status, statusText);
    });

    var DetailStatus = $('#status');
    var DetailStatusText = DetailStatus.text();
    colorStatus(DetailStatus, DetailStatusText);

});