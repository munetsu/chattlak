// Firebaseとの接続するための変数
const newPostRef = firebase.database();

$(document).on('click', '#btn', function(){
    let val = $('input').val();
    newPostRef.ref().push(val);
})


////////////////////////////////////////////
// css動的調整
////////////////////////////////////////////
// textarea
$(function() {
    var $textarea = $('#text');
    var lineHeight = parseInt($textarea.css('lineHeight'));
    $textarea.on('input', function(e) {
      var lines = ($(this).val() + '\n').match(/\n/g).length;
      $(this).height(lineHeight * lines);
    });
  });