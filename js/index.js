////////////////////////////////////////////
// 変数一覧
////////////////////////////////////////////
// Firebaseとの接続するための変数
const newPostRef = firebase.database();

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

////////////////////////////////////////////
// クリック処理
////////////////////////////////////////////
// ルーム一覧画面表示
$(document).on('click', '.newroom', function(e){
    e.preventDefault();
    $('.body').html(viewRoomList());
    return;
})

// 新規ルーム画面閉じる
$(document).on('click', '.fa-times-circle', function(){
    window.location.reload();
})

// 新規ルーム画面表示
$(document).on('click', '.createroom', function(e){
    e.preventDefault();
    $('.body').html(viewNewRoom());
    return;
})

// 新規ルーム作成
$(document).on('click', '.createBtn', function(e){
    e.preventDefault();
    // ルーム名取得
    let roomname = $('input[name=roomname]').val();
    // ルーム説明
    let roomdescription = $('input[name=roomdescription]').val();

    // Firebaseへ登録
    newPostRef.ref('room/').push({
        roomname:roomname,
        roomdescription:roomdescription
    });

    // 登録完了後
    alert('登録完了しました');
    window.location.reload();
})

// ルーム名クリック
$(document).on('click', '.list', function(e){
    e.preventDefault();
    $('.talkfield').empty();
    let roomname = $(this).attr('id');
    // console.log(roomname);
    // ルーム名をタイトルに記載
    $('.talkname').html('<p>'+roomname+'</p>');
    // 送信ボタンにトーク名をつける
    $('.submit').attr('data-room', roomname);
    // Firebaseからルーム内トーク取得
    getRoomTalk(roomname);
})

// ルーム内でのトーク記録
$(document).on('click', '.submit', function(){
    let roomname = $(this).attr('data-room');
    // console.log(roomname);
    // トーク内容を取得
    let contents = $('.text').val();
    // console.log(contents);
    // 日付取得
    let date = getDate();
    // console.log(date);
    // Firebaseへ登録
    newPostRef.ref('talk/'+roomname).push({
        contents:contents,
        date:date
    });
    $('.text').val('');
})


////////////////////////////////////////////
// Firebaseからデータ取得
////////////////////////////////////////////
// ルーム情報取得（読み込み時）
$(function(){
    newPostRef.ref('room').on('child_added',function(data){
        let v = data.val();
        // データが空の場合
        if(v ==null){
            return;
        }
        // console.log(v.roomname);
        // リスト描画
        let view = '<li class="lists"><a href="" id="'+v.roomname+'" class="list">'+v.roomname+'<a/></li>';
        $('.roomlist').append(view);
    })
});

// ルーム内のやりとり取得
function getRoomTalk(title){
    newPostRef.ref('talk/'+title).on('child_added',function(data){
        let v = data.val();
        // データが空の場合
        if(v ==null){
            return;
        }
        // console.log(v);
        // 描画
        let view = `
            <div class="talkend">
                <p class="datetime">`+v.date+`</p>
                <p class="contents">`+v.contents+`</p>
            </div>
        `;
        // クラス設定
        $('.talkend').addClass('talkblock');
        // talkendクラスを除去
        $('.talkblock').removeClass('talkend');
        $('.talkfield').append(view);
        // 一番下までスクロールする
        $('.talkfield').animate({scrollTop: $('.talkfield')[0].scrollHeight}, 'fast');
    })
}

////////////////////////////////////////////
// その他関数一覧
////////////////////////////////////////////
// 日時を取得
function getDate(){
    let d = new Date();
    let year = d.getFullYear(); //西暦取得
    let month = d.getMonth() + 1; //月取得
    let day = d.getDate(); //日付取得
    let date = year+'/'+month+'/'+day+' ';
    let hour = d.getHours(); //時間を取得
    let minutes = d.getMinutes(); //分を取得
    if(minutes >= 10 && hour >=10){
        // 時間・分表示が2桁以上の時
        return date + hour + ":" + minutes;       
    } else if(hour < 10 && minutes < 10){
        // 時間・分表示が1桁の時
        return date + "0"+hour+ ":0" + minutes;
    } else if (hour < 10 && minutes >=10){
        // 時間のみ1桁の時
        return date + "0"+ hour + ":" + minutes;
    } else {
        // 分のみ1桁の時
        return date + hour + ":0" + minutes;
    }
};

////////////////////////////////////////////
// VIEW一覧
////////////////////////////////////////////
// ルーム一覧
function viewRoomList(){
    let view = `
        <div class="header">
            <div class="close">
                <i class="far fa-times-circle fa-3x"></i><br>
                <span>close</span>
            </div>
            <div class="title">
                <div class="titlehead">
                    <p>ルーム一覧</p>
                </div>
                <div class="createroomarea">
                    <a href="" class="createroom">新規ルーム作成</a>
                </div>
            </div>
            <div class="search">
                <input type="text" name="search" placeholder="ルーム名を入力">
            </div>
            <div class="roomlist"></div>
        </div>
    `;
    return view;
}

// 新規ルーム作成
function viewNewRoom(){
    let view = `
        <div class="create">
            <div class="close">
                <i class="far fa-times-circle fa-3x"></i><br>
                <span>close</span>
            </div>
            <table>
                <tr>
                    <td>ルーム名：</td>
                    <td><input type="text" name="roomname" placeholder="ルーム名を入力"></td>
                </tr>
                <tr>
                    <td>ルーム説明(30文字以内)：</td>
                    <td><input type="text" name="roomdescription" maxlength="30"></td>
                </tr>
            </table>
            <div class="createBtnarea">
                <a href="" class="createBtn">ルーム作成</a>
            </div>
        </div>
    `;
    return view;
}