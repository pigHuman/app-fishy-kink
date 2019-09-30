<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>followers</title>
<meta charset="utf-8">
<meta name="description" content="">
<meta name="author" content="">
<meta name="viewport" content="width=device-width, initial-scale=1">

</head>
<body>
    <div class="search-main">
        <div class="search">
            <form action="">
                <input type="text" value="" class="">
                <input type=submit value="検索">
            </form>
        </div>

        <ul class="search-tab">
            <li class="tab_list"><a href="#followers">フォロー</a></li>
            <li class="tab_list"><a href="#following">フォロワー</a></li>     
        </ul>

        <div class="tab-content">
            <div class="tab-pane" id="followers">
        @isset($followData)

            @isset($followData["follow"][0])
                @foreach ($followData["follow"] as $followers)
                <button type="button" onclick="location.href='/followers'">
                    {{ $followers }}
                    @if($followData["userID"]) 
                        {{$followData["profile"]}}
                    @endif
                @endforeach        
            @endisset
            </div>
           

            <div class="tab-pane" id="following">
            @isset($followData["follower"][0])
                @foreach ($followData["follower"] as $following)
                    {{ $following }}  
                @endforeach
            @endisset
            </div>
        @endisset
        <input class="btn btn-success" type="button" onclick="location.href='/home'" value="戻る">
        </div>
    </div>

</body>
</html>