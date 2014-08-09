/**
 * Created by Sunny on 8/3/14.
 */
$(document).ready(function(){


    $('#signUpForm').submit(function(event){
        event.preventDefault();
        var $form = $(this),
            userName = $form.find("input[name='username']").val(),
            passWord = $form.find("input[name='password']").val(),
            retypePassword = $form.find("input[name='Repassword']").val(),
            url = $form.attr("action");

        if(passWord !== retypePassword){
            console.log("wrong passwords");
            $("#warningBar").text("The passwords are not the same!").show();
            $form.trigger("reset");
        }else{
            $form.trigger("submit");
        }
    });

//    $('#signInForm').submit(function(event){
//        event.preventDefault();
//        var $form = $(this),
//            userName = $form.find("#signInUserName").val(),
//            passWord = $form.find("#signInPassword").val(),
//            url = $form.attr('action');
//
//        if(userName === null || userName.length === 0){
//            $("#signInWarning").text("Username cannot be null");
//        }
//        else if(passWord === null || passWord.length === 0){
//            $("#signInWarning").text("Password cannot be null");
//        }
//        else{
//            $.ajax({
//                url:url,
//                data:{username:userName, password:passWord},
//                type:"POST"
//            }).done(function(res){
//                if(typeof res === 'String'){
//                    $("#signInWarning").text(res);
//                }else if(typeof res === 'Object'){
//                    window.location = 'localhost:3000/' + res._id + '/dashboard';
//                }
//            })
//        }
//    })
});