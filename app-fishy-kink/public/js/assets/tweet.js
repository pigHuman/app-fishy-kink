var result;
var tweetCount;

function getTweet(tweet) {

    $.ajax({
    type: 'POST',
    url: '/api/getTweet',
    dataType: 'json',
    async: false,
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
        tweetID: tweet["originTweetID"]
    },
    cache: false
    }).done(function(originTweet) {
    tweet = originTweet["tweet"];
    });
    return tweet;
};

/******************************************************************* ページ読み込んだ瞬間に実行される *******************************************************************/
$(function() { // 遅延処理
    $.ajax({
        type: 'POST',
        url: '/api/reloadTweets', // url: は読み込むURLを表す
        dataType: 'json', // 読み込むデータの種類を記入
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
        userID: ''
        },
        cache: false
    }).done(function(results) {
        // 通信成功時の処理

        result = results;

        dispTweets(result);
        tweetCount = results.length;
        console.log("初期のツイートの数　" + result.length);

    }).fail(function(err) {
        // 通信失敗時の処理
        alert('ファイルの取得に失敗しました。');
    });
});


/******************************************************************* 1秒ごとにツイートの数を取得し数に変動があった場合にアラート表示 *******************************************************************/
$(function() { // 遅延処理
    setInterval((function update() { //1000ミリ秒ごとに実行
    $.ajax({
        type: 'POST',
        url: '/api/reloadTweets', // url: は読み込むURLを表す
        dataType: 'json', // 読み込むデータの種類を記入
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
        userID: ''
        },
        cache: false
    }).done(function(results) {

        if (tweetCount != results.length) {
        // アラートの追加
        document.getElementById('alertContents').innerHTML = '<div id="alert" class="alert alert-info" role="alert">' +
                                                                '<a href="#" class="alert-link">新しいツイート</a>' +
                                                                '</div>';
        console.log("本家のツイートの数　" + results.length);
        console.log("保持しているツイートの数　" + tweetCount);
        }
    }).fail(function(err) {
        // 通信失敗時の処理
        alert('ファイルの取得に失敗しました。');
    });
    return update;
    }()), 10000);
});

/******************************************************************* ツイート表示 *******************************************************************/
function dispTweets(results) {
    $('#centerContents').empty();
    $('.loader').fadeIn();

    let tweetType;
    let userIcon;
    let tweetDocument;
    let countImg;
    let iconColor;
    let reTweetText;

    results.forEach(function(tweet) {

    tweetDocument = "";
    
    tweetDocument += '<div class="tweet card">';
    
    if (tweet["type"] == "retweet") {
        tweetDocument += '<input id="tweetID" type="hidden" value=' + tweet["originTweetID"]["$oid"] + ' />';
        tweetType = '<div class="retweet-user">' + tweet["userID"] + 'さんがリツイートしました</div>';
        tweet = getTweet(tweet);
    } else {
        tweetDocument += '<input id="tweetID" type="hidden" value=' + tweet["_id"]["$oid"] + ' />';
        tweetType = "";
    }

    if (typeof tweet["userImg"] !== "undefined"){
        userIcon = tweet["userImg"];
    }else{
        userIcon = "";
    }

    tweetDocument +=`
    <div class="tweetTop card-header">
        ${tweetType}
        <div class="tweetTop-left" style="display:inline-block; vertical-align:middle;">
        <img src="${userIcon}" width="50px" height="50px" />
        </div>
        <div class="tweetTop-right" style="display:inline-block; vertical-align:middle; position:relative; left:10%;">
        <div class="tweet-user">
            <a href=/profile?user=' + ${tweet["userID"]} + '>
            ${tweet["userID"]}
            </a>
        </div>
        <div class="time">
            ${tweet["time"]}
        </div>
        </div>
    </div>
    <div class="tweetMain card-body">${tweet["text"]}</div>
    <div class="imagePlaces" style=float:left>
    `;

    //画像表示
    countImg = tweet["img"].length;
    for (var i = 0; i < countImg; i++) {
        tweetDocument += `<img src=" ${tweet["img"][i]}"width="200" height="150" />`;
    }

    tweetDocument += `
    </div>
    <div class="tweetBottom d-inline">`;

    //リプライ
    tweetDocument += '<button class=reply type=button><span class="oi oi-action-undo" style="color:blue;"></span> </button>';

    //リツイート
    iconColor = "";
    reTweetText = "";

    if (tweet["type"] == "tweet") {
        if (tweet["retweetUser"].indexOf("{{ session('userID') }}") == -1) {
        iconColor = "gray";
        reTweetText = "リツイート";
        } else {
        iconColor = "green";
        reTweetText = "リツイートを取り消す";
        }
    } else {
        //とりあえず
        iconColor = "pink";
        reTweetText = "これはリツイートです";
    }
    tweetDocument += `
    <div class="accordion">
        <button class=reTweet type=button><span class="oi oi-loop" style="color: ${iconColor} ;"></span> </button>

        <div class="inner">
        <button class=normalReTweet type=button> ${reTweetText}</button>
        <a href=javascript:open2()>🖊コメントつけてリツイート</a>
        </div>
    </div>
    `;

    //ファボ
    if (tweet["fabUser"].indexOf("{{ session('userID') }}") == -1) {
        iconColor = "gray";
        } else {
        iconColor = "red";
    }

    tweetDocument += `<button class=fab type=button><span class="oi oi-heart" style="color:${iconColor};"></span> </button>`;
    
    tweetDocument += '</div>';
    tweetDocument += '</div>';

    $('#centerContents').append(tweetDocument);
    $('.loader').fadeOut();
    });
}

/******************************************************************* 新しいツイートの表示 *******************************************************************/

$(function() { // 遅延処理
    $(document).on("click", ".alert-link", function() {
    $.ajax({
        type: 'POST',
        url: '/api/reloadTweets', // url: は読み込むURLを表す
        dataType: 'json', // 読み込むデータの種類を記入
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
        userID: ''
        },
        cache: false
    }).done(function(results) {

        dispTweets(results);

        $("#alert").remove();
        tweetCount = results.length;

        console.log("本家のツイートの数　" + results.length);
        console.log("保持しているツイートの数　" + tweetCount);

    }).fail(function(err) {
        // 通信失敗時の処理
        alert('ファイルの取得に失敗しました。');
    });
    });
});
