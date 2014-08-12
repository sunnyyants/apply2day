/**
 * Created by Sunny on 8/12/14.
 */
$(document).ready(function(){
    var $status = $("#status");
    var $statusText = $status.text();
    var $statusBar = $('.statusBar');
    console.log($statusText);
    if($statusText === "Phoned"){
        $status.removeClass().addClass('text-warning');
    }else if($statusText === "Code-tested"){
        $status.removeClass().addClass('text-info');
    }else if($statusText === "On-sited"){
        $status.removeClass().addClass('text-primary');
    }else if($statusText === 'Declined'){
        $status.removeClass().addClass('text-danger');
    }else if($statusText === 'Offered'){
        $status.removeClass().addClass('text-success');
    }else{
        $status.removeClass();
        $statusBar.removeClass();
    }
});