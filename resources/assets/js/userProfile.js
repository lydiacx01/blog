document.write('<script src="http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js"></script>');
console.log("在被引用的文件内部");
var profileForm = $("#profileForm");
var message = $(".message");
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$("#updateProfileBtn").bind('click', function(e){
    profileForm.preventDefault();

    let data = {};
    data.name = profileForm.find("input[name=name]").val();
    data.name = profileForm.find("input[name=email]").val();

   $.ajax({
       method: 'post',
       data: data,
       url: '/profile/update',
       success: function (result) {
           var messageContent = document.createElment("span");
           messageContent.innerText = result? "更新成功" : "更新失败";
           messageContent.setAttribute("class", "col-md-4 col-md-offset-4");
           message.appendChild(messageContent);
           message.removeClass("hide");
       }
   });


});