/**
 * Created by Sunny on 8/12/14.
 */
$(document).ready(function(){
    var $status = $("#status");
    var $statusText = $status.text();
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
    }

    $("#searchAppUpdate").on('click', function(){
        var order = $(this).data('search-order');
        var userId = $(this).data('user-id');
        $.redirect("/user/" + userId + "/sort/appDate/" + order);
        $(this).data('search-order',-order);
    })
});