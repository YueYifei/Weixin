var xmlhttp = null;
var rank = -1;
var area;
var tem_seat = "";

function hideElem(id) {
    document.getElementById(id).style.display = 'none';
}

function showElem(id) {
    document.getElementById(id).style.display = 'block';
}

function ticketStateChanged() {
    if (xmlhttp.readyState == 4) {// 4 = "loaded"
        if (xmlhttp.status == 200) {// 200 = OK
            var result = xmlhttp.responseText;
            if (result.indexOf("OK1") == 0) {
                //alert("¸ÃÇøÓÐÓàÆ±   ÇëÑ¡×ù");
                console.log(result);
                showSeats();
                result = result.substring(result.indexOf('_') + 1);
                var seats_active = result.substring(result.indexOf('_') + 1).split(',');
                rank = parseInt(result.substring(0, result.indexOf('_'))) + 1;                         //IntÀàÐÍÅÅÃû
                console.log("rank = " + rank);
                for (var i = 0; i < seats_active.length; i++) {
                    document.getElementById(seats_active[i]).firstChild.src = "http://wx8.igeek.asia/static1/img/seat_active.png";
                }
            }
            switch (result) {
                case 'OK':
                    //document.getElementById('validationHolder').setAttribute('hidden', 'hidden');
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookError');
                    hideElem('areaA');
                    hideElem('areaB');
                    hideElem('areaC');
                    hideElem('areaD');
                    hideElem('seatSubmit');
                    hideElem('footer');
                    hideElem('header');
                    hideElem('theme');
                    document.getElementById('rankPlace').innerText = rank + "";
                    document.getElementById('chosenArea').innerText = area;
                    var Seatchosen = tem_seat.substring(2);
                    document.getElementById('chosenCol').innerText = Seatchosen.substring(0, Seatchosen.indexOf('_'));
                    document.getElementById('chosenRow').innerText = Seatchosen.substring(Seatchosen.indexOf('_') + 1);
                    showElem('bookOK');
                    //document.getElementById('successHolder').removeAttribute('hidden');
                    return;

                case 'actNotExist':
                    //showError('usernameGroup', 'helpUsername', '');
                    //showError('passwordGroup', 'helpPassword', 'Ñ§ºÅ»òÃÜÂë´íÎó£¡ÇëÊäÈëµÇÂ¼infoµÄÑ§ºÅºÍÃÜÂë');
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    hideElem('areaA');
                    hideElem('areaB');
                    hideElem('areaC');
                    hideElem('areaD');
                    hideElem('seatSubmit');
                    showElem('bookError');
                    console.log('actNotExist');
                    break;

                case 'userNotExist':
                    //showError('usernameGroup', 'helpUsername', '');
                    //showError('passwordGroup', 'helpPassword', 'Ñ§ºÅ»òÃÜÂë´íÎó£¡ÇëÊäÈëµÇÂ¼infoµÄÑ§ºÅºÍÃÜÂë');
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    hideElem('areaA');
                    hideElem('areaB');
                    hideElem('areaC');
                    hideElem('areaD');
                    hideElem('seatSubmit');
                    showElem('bookError');
                    console.log('userNotExist');
                    break;

                case 'Error':
                    //showError('submitGroup', 'helpSubmit', '³öÏÖÁËÆæ¹ÖµÄ´íÎó£¬ÎÒÃÇÒÑ¾­¼ÇÂ¼ÏÂÀ´ÁË£¬ÇëÉÔºóÖØÊÔ¡£')
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    hideElem('areaA');
                    hideElem('areaB');
                    hideElem('areaC');
                    hideElem('areaD');
                    hideElem('seatSubmit');
                    showElem('bookError');
                    console.log('Error');
                    break;

                    //case 'OK1':
                    //alert("¸ÃÇøÓÐÓàÆ±   ÇëÑ¡×ù");
                    //showSeats();
                    //break;

                case 'TicketBooked':
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    hideElem('areaA');
                    hideElem('areaB');
                    hideElem('areaC');
                    hideElem('areaD');
                    hideElem('seatSubmit');
                    showElem('bookError');
                    console.log('TicketBooked');
                    break;

                case 'NoTicket':
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    hideElem('areaA');
                    hideElem('areaB');
                    hideElem('areaC');
                    hideElem('areaD');
                    hideElem('seatSubmit');
                    showElem('bookError');
                    console.log('No Ticket');
                    break;

            }
        }
        else {
            showError('submitGroup', 'helpSubmit', '服务器连接异常，请稍后重试。')
        }
        showLoading(false);
        disableAll(false);
    }
}

function curDateTime() {
    var d = new Date();
    var year = d.getYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();
    var curDateTime = year + 1900;
    if (month > 9)
        curDateTime = curDateTime + "-" + month;
    else
        curDateTime = curDateTime + "-0" + month;
    if (date > 9)
        curDateTime = curDateTime + "-" + date;
    else
        curDateTime = curDateTime + "-0" + date;
    if (hours > 9)
        curDateTime = curDateTime + " " + hours;
    else
        curDateTime = curDateTime + " 0" + hours;
    if (minutes > 9)
        curDateTime = curDateTime + ":" + minutes;
    else
        curDateTime = curDateTime + ":0" + minutes;
    if (seconds > 9)
        curDateTime = curDateTime + ":" + seconds;
    else
        curDateTime = curDateTime + ":0" + seconds;
    return curDateTime;
}


function submitSeats(openid, actid, seat) {
    var form = document.getElementById('validationForm'),
        elems = form.elements,
        url = form.action,
        params = "openid=" + encodeURIComponent(openid),
        i, len;
    params += '&' + "actid" + '=' + encodeURIComponent(actid);
    params += '&' + "seat" + '=' + encodeURIComponent(seat);
    var now = curDateTime();
    params += '&' + "now" + '=' + encodeURIComponent(now);
    for (i = 0, len = elems.length; i < len; ++i) {
        params += '&' + elems[i].name + '=' + encodeURIComponent(elems[i].value);
    }
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = ticketStateChanged;
    xmlhttp.send(params);
    return false;
}

function showSeats() {
    hideElem("usernameGroup");
    hideElem("submitGroup");
    switch (area) {
        case 'A':
            showElem("areaA");
            break;
        case 'B':
            showElem("areaB");
            break;
        case 'C':
            showElem("areaC");
            break;
        case 'D':
            showElem("areaD");
            break;
    }
    showElem("seatSubmit");
}

function showLoading(flag) {
    //var dom = document.getElementById('helpLoading');
    if (flag) {
        //dom.removeAttribute('hidden');
        showElem('helpLoading');
    } else {
        //dom.setAttribute('hidden', 'hidden');
        hideElem('helpLoading');
    }
}


function showError(groupid, helpid, text) {
    var dom = document.getElementById(helpid);
    dom.innerText = text;
    //dom.removeAttribute('hidden');
    showElem(helpid);
    document.getElementById(groupid).setAttribute('class', 'form-group has-error');
}