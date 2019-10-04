<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>myPage</title>
<meta charset="utf-8">
<meta name="description" content="">
<meta name="author" content="">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<link rel="stylesheet" href="font/css/open-iconic-bootstrap.css">
<link rel="stylesheet" type="text/css" href="css/myPage.css">
</head>
<body>
@isset($userData)
    <div>
        <div class="userData">
            <img id="myIcon" src='{{ $userData["userImg"] }}' alt="myIcon" />
            <p id="usenName">ユーザー {{ $userData["userName"] }}</p>
            <p id="userId"><span>@</span>{{ $userData["userID"] }}</p>
        </div>
        @if ( isset ($userData["follow"]) )

            <button type="button" onclick="location.href='/following'">フォロー<span class="follow"></span>{{ count($userData["follow"]) }}人</button>
        @else
            <button type="button" onclick="location.href='/following'">フォロー<span class="follow"></span>0人</button>
        @endif

        @if ( isset ($userData["follower"]) )
            <button type="button" onclick="location.href='/followers'">フォロワー<span class="follower"></span>{{ count($userData["follower"]) }} 人</button>
        @else
            <button type="button" onclick="location.href='/followers'">フォロー<span class="follower"></span>0人</button>
        @endif

        <input class="setButton" type="button" onclick="location.href='/setting'" value="プロフィール変更" />
    </div>
    <div class="profile">
        <p>プロフィール</p>
           <p>{{ $userData["profile"] }}</p>
    </div>
    <div class="tweet">
        <p >ツイート</p>
        <div style="height:400px; width:900px; overflow-y:scroll;">
            <table height="100" width="600">
                @isset($tweetData)

                @foreach ( $tweetData as $tweet)
                <div class="tweetTop card-header">
                    @if ($tweet["type"] == "retweet")
                        <div class="retweet-user">{{ $tweet["userID"] }}さんがリツイートしました</div>

                    @endif
                    <div class="tweet-user"> {{ $tweet["userID"] }} </div>
                        <div class="time"> {{ $tweet["time"] }}</div>
                                <!-- <div class="date">{{ explode(" ",$tweet["time"])[0] }}</div> 　
                                <div class="time">{{ explode(" ",$tweet["time"])[1] }}</div> -->
                        </div>
                        <div class="tweetMain card-body">
                            {{ $tweet["text"] }}
                        </div>
                        <div class="tweetBottom d-inline">
                            <div class="reply d-inline-block">
                                <image src="images/reply.jpg"/>
                            </div>
                            <div class="retweet d-inline-block">
                                <image src="images/retweet.png"/>
                            </div>
                            <div class="fab d-inline-block">
                                <image src="images/fabo.jpg"/>
                            </div>
                        </div>
                    </div>
                @endforeach           
                @else
                    <p id=error_tweet >ツイートがありません</p>
                @endisset
            </table>
        </div>
    </div>
    <input class="btn btn-success" type="button" onclick="location.href='/home'" value="戻る">
    @else
    <p id="error">エラー</p>
    @endisset
</body>

</html>