/**
 * Created by Sunny on 8/8/14.
 */
$(document).ready(function(){


    $('#signUpForm').submit(function(event){
        event.preventDefault();
        var $form = $(this),
            userName = $form.find("input[name='username']").val(),
            passWord = $form.find("input[name='password']").val(),
            retypePassword = $form.find("input[name='Repassword']").val();

        if(passWord !== retypePassword){
            console.log("wrong passwords");
            $("#warningBar").text("The passwords are not the same!").show();
            $form.trigger("reset");
        }else{
            $form.trigger("submit");
        }
    });

    $('#signInForm').submit(function(event){
        event.preventDefault();
        var $form = $(this),
            userName = $form.find("input[name='username']").val(),
            passWord = $form.find("input[name='password']").val();

        if(userName === null || userName.length === 0){
            $("#warningBar").text("Username cannot be null").show();
            $form.trigger("reset")
        }
        else if(passWord === null || passWord.length === 0){
            $("#warningBar").text("Password cannot be null").show();
            $form.trigger("reset")
        }
        else{
            $form.trigger("submit");
        }
    })
});