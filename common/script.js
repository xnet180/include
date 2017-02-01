
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-80181649-1', 'auto');
ga('send', 'pageview');



//Ex)'#template',"root": [{"name": "title","link": "#"}]
function autoRender(template,data) {
    var out='out';
    out=template.substr(1)+'_'+out;
    var container = document.createElement(out);
    container.id=out;
    $(template).after(container);
    $('#'+out).append(
        Mustache.render(
            $(template).html(),data
        )
    );
}

//Ex)'#output',"template.html","table",{"root": [{"name": "google","link": "http://google.com/"}]}
function autoExRender(output,loadFile,templateById,data) {
    $(output).load(loadFile+' #'+templateById,function(){
        $(output).html(Mustache.render(document.getElementById(templateById).innerHTML,data));
    });
}


//xCalendar
function addAutoContact(name,yyyy_mm_dd,text){
    var date = new Date(yyyy_mm_dd);
    addSchedule("xcd_"+name+"_"+yyyy_mm_dd.replace( /\u002f/g ,""),
            '<a href="'+encodeURI('mailto:kamiji@srtjp.co.jp?subject='+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+"出発"+document.location.pathname.split("/").pop().split(".").shift()+
            '&body='+
                "お問い合わせいただきありがとうございます。\r\n"
                +"\r\n"
                +"ご質問は以下にお知らせ下さい。\r\n"
                +"\r\n"
                +"また、ツアー名"+(document.location.pathname.split("/").pop().split(".").shift()+"の"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate())+"出発の\r\n"
                +"予約状況を確認いたします。\r\n"
                +"\r\n"
                +"参加者全員のお名前、性別（パスポート記載のローマ字）\r\n"
                +"と代表の方の携帯番号をお知らせ下さい。\r\n"
                +"お名前：\r\n"
                +"\r\n"
                +"携帯番号：\r\n"
                +"\r\n"
                +"回答は24時間以内（土、日、祝除く）にいたします。\r\n"
                +"連絡がない場合はお手数ですがお電話にてお問い合わせ下さい 。\r\n"
                +"06-6779-5636 サンライズ観光　上地（かみぢ）\r\n"
                +"宜しくお願い致します。\r\n"
                )
            +'">'+text+'</a>'
    );
}
function createMailto(to,title,body){
    return 'mailto:'+to+'?subject='+encodeURI(title)+'&body='+encodeURI(body);
}
function createLink(avalue,link){
    return '<a href="'+link+'">'+avalue+'</a>';
}

function addSchedule(selector,html){
    var elm = document.getElementById(selector);
    if(elm != null){
        elm.innerHTML=html;
    }
}
function addMultiSchedule(name,yyyy_mm_dd,period,html){
    var date = new Date(yyyy_mm);
    var m = date.getMonth()+1;
    m=m<10?"0"+m:m;
    for(var i=0; i<period; i++) {
        var d=(date.getDate()+i);
        addSchedule('xcd_'+name+'_'+date.getFullYear()+m+(d<10?"0"+d:d),html);
    }
}
function addMatrixSchedule(name,x1,x2,y1,y2,html){
    if(x2<x1||y2<y1){
        console.log('param error');
        return;
    }
    for(var x=x1;x<=x2;x++) {
        for(var y=y1;y<=y2;y++) {
            write(html);
        }
    }
    function write(html){
        var td =document.getElementById('xcd_'+name+'_'+x+'x'+y);
        if(td == null){
            return;
        }
        var elmList = td.children;
        for (var z = 0; z < elmList.length; z++){
            var elm = elmList[z];
            if(elm.className==="xc_day_contents") {
                elm.innerHTML =html;
            }
        }
    }
}
function createCalendar(name,yyyy_mm){
    var date = new Date(yyyy_mm +'/01 00:00:00' + ' +0900');
    date.setDate(1);
    var y = date.getFullYear();
    var m = date.getMonth();
    var indent = date.getDay();
    var monthTbl = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (((y%4)===0 && (y%100)!==0) || (y%400)===0){
        monthTbl[1] = 29;
    }
    var now = new Date();
    var col = 7;
    var row = Math.ceil((indent+monthTbl[m])/7) ;
    var contents = createHeaderContents();
    for(var i=0; i<col*row; i++) {
        var cell=(i+1);
        var d=cell-indent;
        if(cell%col==1){
            contents+=weekStart();
        }
        if(d <= 0 || d > monthTbl[m]){
            contents+=createNotDayContents();
        }else{
            date.setDate(d);
            if (now < date) {
                contents+=createEnableDayContents();
            }else{
                contents+=createDisableDayContents();
            }
        }
        if(cell%col==0){
            contents+=weekEnd();
        }
    }
    contents+=createFooterContents();
    render(name,contents);

    //Customize
    function render(name,contents){
        document.write('<div id="'+name+'" class="xCalendar">'+contents+'</div>');
    }
    function createHeaderContents(){
        return '<div class="xcYearMonth">'+y+'-'+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m]+'</div>'+
            '<table border="1">'+
            '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
    }
    function createFooterContents(){
        return '</table>';
    }
    function weekStart(){
        return '<tr>';
    }
    function weekEnd(){
        return '</tr>';
    }
    function createNotDayContents(){
        return createTDtag(false,'-');
    }
    function createEnableDayContents(){
        return uniqueTmp(true);
    }
    function createDisableDayContents(){
        return uniqueTmp(false);
    }
    //UtilsFunction
    function createTDtag(flg,tdContents){
        return '<td id="'+'xcd'+'_'+name+'_'+String((i%col)+1)+'x'+ String(Math.floor((cell+col-1)/7))+'" class="'+(flg?"xcEnable":"xcDisable")+'">'+tdContents+'</td>';
    }
    function uniqueTmp(flg){
        return createTDtag(flg,
                '<div class="xc_day">'+d+'</div>'+
                '<div class="xc_day_contents" id="'+String('xcd'+'_'+name+'_'+y+((m+1)<10?"0"+(m+1):(m+1))+(d<10?"0"+d:d))+'">'+'&nbsp;</div>'
        );
    }
}
