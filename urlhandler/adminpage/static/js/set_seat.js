var seats_to_publish = [];

function deleteSeat(seat){
	for(var i = seats_to_publish.length; i >= 0; i--){
		if(seats_to_publish[i] == seat){
			seats_to_publish.splice(i, 1);				//删掉位置为i的1个元素
			break;
		}
	}
}
//判断是否是新清华学堂确实存在的座位，若不是则disable，并设置颜色为白色
function set_XTHXT_seat(){
	for(var i = 0; i < seatNum; i++){
		if (!is_XTHXT_seat(i)){		//不是新清华学堂的票
			$("#"+i).css({"background-color":"white"});
			$("#"+i)[0].setAttribute("disabled", "disabled");
		}
		else{
			//将各区的票分颜色显示
			var XTHXT_seat_id = get_XTHXT_seat_id(i);
			var area = XTHXT_seat_id.split("_")[0];

			set_area(i, area);
			set_seat_color(i, area, "INIT");
		}
	}

}

function hideElem(id){
	$("#"+id).css({"display":"none"});
}

function showElem(id){
	$("#"+id).css({"display":"block"});
}
function selectOnChange(value){
    removeAreas();
    if(value == 0){											//不选座
    	place = "";
    	showElem("total_number");
    	return;
    }

    initArea();
    if(value == 1){                                         //选择综体，
    	place = "ZT";
    	showElem("total_number");
        return;
    }
    if(value == 2){                                         //选择新清华学堂
    	place = "XTHXT";
        set_XTHXT_seat();
        hideElem("total_number");
        return;
    }
}


function removeAreas(){
    $(".seats")[0].remove();
    $(".checkBoxes")[0].remove();
    $(".total_tickets").remove();

    var frag = document.createDocumentFragment();
    frag.appendChild(document.createElement("div"));
    frag.firstElementChild.className = "checkBoxes";
    $(".chooseArea")[0].appendChild(frag);

    var frag2 = document.createDocumentFragment();
    frag2.appendChild(document.createElement("div"));
    frag2.firstElementChild.className = "seats";
    $(".chooseArea")[0].appendChild(frag2);

    var frag3 = document.createDocumentFragment();
    frag3.appendChild(document.createElement("div"));
    frag3.firstElementChild.className = "total_tickets";
    $(".areaSeatNum")[0].appendChild(frag3);

}

function initArea(){												//生成选座区
    //生成提示信息
    var remind = document.createDocumentFragment();
    remind.appendChild(document.createElement("div"));
	remind.firstElementChild.className = "col-sm-2";
    remind.firstElementChild.innerText = "请选择要发票的座位：";
    $(".checkBoxes")[0].appendChild(remind);

    //生成复选框
    var temArr = ["A", "B", "C", "D"];
    for(var i = 0; i < temArr.length; i++){
    	var newCheckBox = document.createDocumentFragment();
    	newCheckBox.appendChild(document.createElement("div"));
    	var innerHTML = '<p class = "col-sm-2"></p> <p class = "col-sm-10"><input type = "checkbox" class = "checkArea" id = "checkArea_'+temArr[i]+'">'+temArr[i]+'区全选</p>';
        newCheckBox.firstElementChild.innerHTML = innerHTML;

        $(".checkBoxes")[0].appendChild(newCheckBox);
    }

    //生成票数统计区
    for(var i = 0; i < temArr.length; i++){
    	var newfrag = document.createDocumentFragment();
    	newfrag.appendChild(document.createElement("div"));
		newfrag.firstElementChild.className = "form-group";
    	var innerHTML = '<label for="input-total_tickets_'+temArr[i]+'" class="col-sm-2 control-label">'+temArr[i]+'区票数</label> <div class="col-sm-10"> <input type="number" value = "0" name="total_tickets_'+temArr[i]+'" class="form-control" id="input-total_tickets_'+temArr[i]+'" min="0" placeholder = "'+temArr[i]+'区发票总数" readonly="readonly"> </div>';
        newfrag.firstElementChild.innerHTML = innerHTML;
        $(".total_tickets")[0].appendChild(newfrag);

    	var newfrag2 = document.createDocumentFragment();
    	newfrag2.appendChild(document.createElement("div"));
		newfrag2.firstElementChild.className = "form-group";
    	var innerHTML2 = ' <label for="input-seats_for_choose_'+temArr[i]+'" class="col-sm-2 control-label"></label> <div class="col-sm-10"> <textarea class="form-control seats_for_choose" name="seats_for_choose_'+temArr[i]+'" value = "" id="input-seats_for_choose_'+temArr[i]+'" row="3" style="resize: none;" readonly="readonly"></textarea> </div>';
        newfrag2.firstElementChild.innerHTML = innerHTML2;
        $(".total_tickets")[0].appendChild(newfrag2);
    }


    //生成座位
    for(var i = 0; i < seatNum; i ++){          				//每行30个座位
        var seat = document.createDocumentFragment();
        seat.appendChild(document.createElement("button"));
        seat.firstElementChild.className = "seat";
        seat.firstElementChild.setAttribute("id", i);
        seat.firstElementChild.setAttribute("type", "button");
        $(".seats")[0].appendChild(seat);

        document.getElementById(i+"").addEventListener('click', function(e){
        	button_on_click(e);
        },false);
    }

    //设置座位css属性
    $(".seat").css({"height": "26px", "width": "26px", "margin":"6px", "border": "1px"});

    $(".seats").css({"margin-top":"30px", "margin-bottom": "30px"});

	$(".checkArea").change(function(e){
		console.log(e.target.id);
		var targetId = e.target.id;
		var area = targetId.replace("checkArea_", "");

		if($("#"+targetId).is(":checked") == true){			//全选,对应票数为座位总数
			$(".area_"+area).css({"background-color": get_seat_color(area+"ChoosenColor")});
			document.getElementById("input-total_tickets_"+area).value = $(".area_"+area).length;
			seats_to_publish = seats_to_publish.filter(function(item){return (startsWith(item, area))});
			for(var i = 0; i < $(".area_"+area).length; i++){
				seats_to_publish.push(get_XTHXT_seat_id($(".area_"+area)[i].id));
			}
			document.getElementById("input-seats_for_choose_"+area).value = seats_to_publish.filter(function(item){return startsWith(item, area)});
			calcuTotalSeatNumber();
		}
		else{												//全不选，对应票数为0
			$(".area_"+area).css({"background-color": get_seat_color(area+"Color")});
			document.getElementById("input-total_tickets_"+area).value = 0;
			seats_to_publish = seats_to_publish.filter(function(item){return !(startsWith(item, area))});
			document.getElementById("input-seats_for_choose_"+area).value = seats_to_publish.filter(function(item){return startsWith(item, area)});
			calcuTotalSeatNumber();
		}
	})

}

function button_on_click(e){

	if(place = "XTHXT"){
		//拿到对应新清华学堂的座位id
		var XTHXT_seat_id = 0;
		XTHXT_seat_id = get_XTHXT_seat_id(e.target.getAttribute("id"));
		area = XTHXT_seat_id.split("_")[0];									//区
		row  = parseInt(XTHXT_seat_id.split("_")[1]);						//排
		seat = parseInt(XTHXT_seat_id.split("_")[2]);						//座位号

		if(isChoosen(e.target.getAttribute("id"))){
			//票数减一
			document.getElementById("input-total_tickets_"+area).value = parseInt(document.getElementById("input-total_tickets_"+area).value) - 1;
			set_seat_color(e.target.getAttribute("id"), area, "INIT")
			deleteSeat(XTHXT_seat_id);
			document.getElementById("input-seats_for_choose_"+area).value = seats_to_publish.filter(function(item){return startsWith(item, area)});
			calcuTotalSeatNumber();
		}
		else{
			//票数加一
			if(document.getElementById("input-total_tickets_"+area).value == ""){
				document.getElementById("input-total_tickets_"+area).value = 1;
			}
			else{
				document.getElementById("input-total_tickets_"+area).value = parseInt(document.getElementById("input-total_tickets_"+area).value) + 1;
			}
			set_seat_color(e.target.getAttribute("id"), area, "CHOOSE")
			seats_to_publish.push(XTHXT_seat_id);
			document.getElementById("input-seats_for_choose_"+area).value = seats_to_publish.filter(function(item){return startsWith(item, area)});
			calcuTotalSeatNumber();
		}
	}
}

function calcuTotalSeatNumber(){
	var totalSeatNumber = parseInt($("#input-total_tickets_A")[0].value) + parseInt($("#input-total_tickets_B")[0].value) + parseInt($("#input-total_tickets_C")[0].value) + parseInt($("#input-total_tickets_D")[0].value);
	$("#input-total_tickets")[0].value = totalSeatNumber;
}

function isChoosen(id){
	var nowColor = $("#"+id)[0].style.backgroundColor;
	if(nowColor == AChoosenColor || nowColor == BChoosenColor || nowColor == CChoosenColor || nowColor == DChoosenColor){
		return true;
	}
	return false;
}

function get_XTHXT_seat_id(id){
	for(var i = 0; i < seatTable.length; i++){
		if(seatTable[i][0] == id){
			return seatTable[i][1];
		}
	}
	return "";
}

function startsWith(arr1, subArr){
	if(arr1.indexOf(subArr) == 0){
		return true;
	}
	return false;
}





var place = "";
var seatNum = 420;
var AColor 			= "rgb(165, 254, 236)";
var AChoosenColor 	= "rgb(0, 222, 217)";
var BColor 			= "rgb(252, 164, 251)";
var BChoosenColor 	= "rgb(222, 0, 219)";
var CColor 			= "rgb(186, 254, 165)";
var CChoosenColor 	= "rgb(52, 222, 0)";
var DColor 			= "rgb(252, 251, 164)";
var DChoosenColor 	= "rgb(222, 219, 0)";

function get_seat_color(arg){
	switch(arg){
		case "AColor":
			return AColor;
		case "BColor":
			return BColor;
		case "CColor":
			return CColor;
		case "DColor":
			return DColor;
		case "AChoosenColor":
			return AChoosenColor;
		case "BChoosenColor":
			return BChoosenColor;
		case "CChoosenColor":
			return CChoosenColor;
		case "DChoosenColor":
			return DChoosenColor;
		default:
			return "";
	}
}

function set_area(id, area){
	if(area == "A"){
		$("#"+id)[0].className += " area_A";
	}
	else if (area == "B"){
		$("#"+id)[0].className += " area_B";
	}
	else if (area == "C"){
		$("#"+id)[0].className += " area_C";
	}
	else if (area == "D"){
		$("#"+id)[0].className += " area_D";
	}

}
function set_seat_color(id, area, stat){

	if(stat == "INIT"){
		if(area == "A"){
			$("#"+id).css({"background-color":AColor});
		}
		else if (area == "B"){
			$("#"+id).css({"background-color":BColor});
		}
		else if (area == "C"){
			$("#"+id).css({"background-color":CColor});
		}
		else if (area == "D"){
			$("#"+id).css({"background-color":DColor});
		}
	}
	else if(stat == "CHOOSE"){
		if(area == "A"){
			$("#"+id).css({"background-color":AChoosenColor});
		}
		else if (area == "B"){
			$("#"+id).css({"background-color":BChoosenColor});
		}
		else if (area == "C"){
			$("#"+id).css({"background-color":CChoosenColor});
		}
		else if (area == "D"){
			$("#"+id).css({"background-color":DChoosenColor});
		}
	}
}

function is_XTHXT_seat(seat_id){
	//走廊等
	if (seat_id % 30 == 5 || seat_id % 30 == 24){
		return false;
	}

	//非新清华学堂的座位
	var arr_not_XTHXT_seat = [0, 1, 30, 28, 29, 59, 390, 419];
	if(arr_not_XTHXT_seat.indexOf(seat_id) >= 0){
		return false;
	}
	if(seat_id >= 300 && seat_id < 330){
		return false;
	}
	return true;
}


//id-新清华学堂id-综体-id对应表
var seatTable = [[0,"C_1_0", 0]
, [1,"C_1_1",1]
, [2,"C_1_1",2]
, [3,"C_1_2",3]
, [4,"C_1_3",4]
, [5,"A_1_5",5]
, [6,"A_1_1",6]
, [7,"A_1_2",7]
, [8,"A_1_3",8]
, [9,"A_1_4",9]
, [10,"A_1_5",10]
, [11,"A_1_6",11]
, [12,"A_1_7",12]
, [13,"A_1_8",13]
, [14,"A_1_9",14]
, [15,"A_1_10",15]
, [16,"A_1_11",16]
, [17,"A_1_12",17]
, [18,"A_1_13",18]
, [19,"A_1_14",19]
, [20,"A_1_15",20]
, [21,"A_1_16",21]
, [22,"A_1_17",22]
, [23,"A_1_18",23]
, [24,"C_1_24",24]
, [25,"C_1_4",25]
, [26,"C_1_5",26]
, [27,"C_1_6",27]
, [28,"C_1_28",28]
, [29,"C_1_29",29]
, [30,"C_2_30",30]
, [31,"C_2_1",31]
, [32,"C_2_2",32]
, [33,"C_2_3",33]
, [34,"C_2_4",34]
, [35,"A_2_5",35]
, [36,"A_2_1",36]
, [37,"A_2_2",37]
, [38,"A_2_3",38]
, [39,"A_2_4",39]
, [40,"A_2_5",40]
, [41,"A_2_6",41]
, [42,"A_2_7",42]
, [43,"A_2_8",43]
, [44,"A_2_9",44]
, [45,"A_2_10",45]
, [46,"A_2_11",46]
, [47,"A_2_12",47]
, [48,"A_2_13",48]
, [49,"A_2_14",49]
, [50,"A_2_15",50]
, [51,"A_2_16",51]
, [52,"A_2_17",52]
, [53,"A_2_18",53]
, [54,"A_2_0",54]
, [55,"C_2_5",55]
, [56,"C_2_6",56]
, [57,"C_2_7",57]
, [58,"C_2_8",58]
, [59,"C_2_9",59]
, [60,"C_3_1",60]
, [61,"C_3_2",61]
, [62,"C_3_3",62]
, [63,"C_3_4",63]
, [64,"C_3_5",64]
, [65,"C_3_0",65]
, [66,"A_3_1",66]
, [67,"A_3_2",67]
, [68,"A_3_3",68]
, [69,"A_3_4",69]
, [70,"A_3_5",70]
, [71,"A_3_6",71]
, [72,"A_3_7",72]
, [73,"A_3_8",73]
, [74,"A_3_9",74]
, [75,"A_3_10",75]
, [76,"A_3_11",76]
, [77,"A_3_12",77]
, [78,"A_3_13",78]
, [79,"A_3_14",79]
, [80,"A_3_15",80]
, [81,"A_3_16",81]
, [82,"A_3_17",82]
, [83,"A_3_18",83]
, [84,"A_3_0",84]
, [85,"C_3_6",85]
, [86,"C_3_7",86]
, [87,"C_3_8",87]
, [88,"C_3_9",88]
, [89,"C_3_10",89]
, [90,"C_4_1",90]
, [91,"C_4_2",91]
, [92,"C_4_3",92]
, [93,"C_4_4",93]
, [94,"C_4_5",94]
, [95,"A_4_0",95]
, [96,"A_4_1",96]
, [97,"A_4_2",97]
, [98,"A_4_3",98]
, [99,"A_4_4",99]
, [100,"A_4_5",100]
, [101,"A_4_6",101]
, [102,"A_4_7",102]
, [103,"A_4_8",103]
, [104,"A_4_9",104]
, [105,"A_4_10",105]
, [106,"A_4_11",106]
, [107,"A_4_12",107]
, [108,"A_4_13",108]
, [109,"A_4_14",109]
, [110,"A_4_15",110]
, [111,"A_4_16",111]
, [112,"A_4_17",112]
, [113,"A_4_18",113]
, [114,"B_4_0",114]
, [115,"C_4_6",115]
, [116,"C_4_7",116]
, [117,"C_4_8",117]
, [118,"C_4_9",118]
, [119,"C_4_10",119]
, [120,"C_5_1",120]
, [121,"C_5_2",121]
, [122,"C_5_3",122]
, [123,"C_5_4",123]
, [124,"C_5_5",124]
, [125,"B_5_0",125]
, [126,"B_5_1",126]
, [127,"B_5_2",127]
, [128,"B_5_3",128]
, [129,"B_5_4",129]
, [130,"B_5_5",130]
, [131,"B_5_6",131]
, [132,"B_5_7",132]
, [133,"B_5_8",133]
, [134,"B_5_9",134]
, [135,"B_5_10",135]
, [136,"B_5_11",136]
, [137,"B_5_12",137]
, [138,"B_5_13",138]
, [139,"B_5_14",139]
, [140,"B_5_15",140]
, [141,"B_5_16",141]
, [142,"B_5_17",142]
, [143,"B_5_18",143]
, [144,"B_5_0",144]
, [145,"C_5_6",145]
, [146,"C_5_7",146]
, [147,"C_5_8",147]
, [148,"C_5_9",148]
, [149,"C_5_10",149]
, [150,"C_6_1",150]
, [151,"C_6_2",151]
, [152,"C_6_3",152]
, [153,"C_6_4",153]
, [154,"C_6_5",154]
, [155,"B_6_0",155]
, [156,"B_6_1",156]
, [157,"B_6_2",157]
, [158,"B_6_3",158]
, [159,"B_6_4",159]
, [160,"B_6_5",160]
, [161,"B_6_6",161]
, [162,"B_6_7",162]
, [163,"B_6_8",163]
, [164,"B_6_9",164]
, [165,"B_6_10",165]
, [166,"B_6_11",166]
, [167,"B_6_12",167]
, [168,"B_6_13",168]
, [169,"B_6_14",169]
, [170,"B_6_15",170]
, [171,"B_6_16",171]
, [172,"B_6_17",172]
, [173,"B_6_18",173]
, [174,"B_6_0",174]
, [175,"C_6_6",175]
, [176,"C_6_7",176]
, [177,"C_6_8",177]
, [178,"C_6_9",178]
, [179,"C_6_10",179]
, [180,"C_7_1",180]
, [181,"C_7_2",181]
, [182,"C_7_3",182]
, [183,"C_7_4",183]
, [184,"C_7_5",184]
, [185,"B_7_0",185]
, [186,"B_7_1",186]
, [187,"B_7_2",187]
, [188,"B_7_3",188]
, [189,"B_7_4",189]
, [190,"B_7_5",190]
, [191,"B_7_6",191]
, [192,"B_7_7",192]
, [193,"B_7_8",193]
, [194,"B_7_9",194]
, [195,"B_7_10",195]
, [196,"B_7_11",196]
, [197,"B_7_12",197]
, [198,"B_7_13",198]
, [199,"B_7_14",199]
, [200,"B_7_15",200]
, [201,"B_7_16",201]
, [202,"B_7_17",202]
, [203,"B_7_18",203]
, [204,"C_7_0",204]
, [205,"C_7_6",205]
, [206,"C_7_7",206]
, [207,"C_7_8",207]
, [208,"C_7_9",208]
, [209,"C_7_10",209]
, [210,"C_8_1",210]
, [211,"C_8_2",211]
, [212,"C_8_3",212]
, [213,"C_8_4",213]
, [214,"C_8_5",214]
, [215,"C_8_0",215]
, [216,"B_8_1",216]
, [217,"B_8_2",217]
, [218,"B_8_3",218]
, [219,"B_8_4",219]
, [220,"B_8_5",220]
, [221,"B_8_6",221]
, [222,"B_8_7",222]
, [223,"B_8_8",223]
, [224,"B_8_9",224]
, [225,"B_8_10",225]
, [226,"B_8_11",226]
, [227,"B_8_12",227]
, [228,"B_8_13",228]
, [229,"B_8_14",229]
, [230,"B_8_15",230]
, [231,"B_8_16",231]
, [232,"B_8_17",232]
, [233,"B_8_18",233]
, [234,"C_8_0",234]
, [235,"C_8_6",235]
, [236,"C_8_7",236]
, [237,"C_8_8",237]
, [238,"C_8_9",238]
, [239,"C_8_10",239]
, [240,"C_9_1",240]
, [241,"C_9_2",241]
, [242,"C_9_3",242]
, [243,"C_9_4",243]
, [244,"C_9_5",244]
, [245,"C_9_0",245]
, [246,"C_9_1",246]
, [247,"C_9_2",247]
, [248,"C_9_3",248]
, [249,"C_9_4",249]
, [250,"C_9_5",250]
, [251,"C_9_6",251]
, [252,"C_9_7",252]
, [253,"C_9_8",253]
, [254,"C_9_9",254]
, [255,"C_9_10",255]
, [256,"C_9_11",256]
, [257,"C_9_12",257]
, [258,"C_9_13",258]
, [259,"C_9_14",259]
, [260,"C_9_15",260]
, [261,"C_9_16",261]
, [262,"C_9_17",262]
, [263,"C_9_18",263]
, [264,"C_9_0",264]
, [265,"C_9_6",265]
, [266,"C_9_7",266]
, [267,"C_9_8",267]
, [268,"C_9_9",268]
, [269,"C_9_10",269]
, [270,"C_10_1",270]
, [271,"C_10_2",271]
, [272,"C_10_3",272]
, [273,"C_10_4",273]
, [274,"C_10_5",274]
, [275,"C_10_0",275]
, [276,"C_10_1",276]
, [277,"C_10_2",277]
, [278,"C_10_3",278]
, [279,"C_10_4",279]
, [280,"C_10_5",280]
, [281,"C_10_6",281]
, [282,"C_10_7",282]
, [283,"C_10_8",283]
, [284,"C_10_9",284]
, [285,"C_10_10",285]
, [286,"C_10_11",286]
, [287,"C_10_12",287]
, [288,"C_10_13",288]
, [289,"C_10_14",289]
, [290,"C_10_15",290]
, [291,"C_10_16",291]
, [292,"C_10_17",292]
, [293,"C_10_18",293]
, [294,"C_10_0",294]
, [295,"C_10_6",295]
, [296,"C_10_7",296]
, [297,"C_10_8",297]
, [298,"C_10_9",298]
, [299,"C_10_10",299]
, [300,"D_7_0",300]
, [301,"D_7_0",301]
, [302,"D_7_0",302]
, [303,"D_7_0",303]
, [304,"D_7_0",304]
, [305,"D_7_0",305]
, [306,"D_7_0",306]
, [307,"D_7_0",307]
, [308,"D_7_0",308]
, [309,"D_7_0",309]
, [310,"D_8_0",310]
, [311,"D_8_0",311]
, [312,"D_8_0",312]
, [313,"D_8_0",313]
, [314,"D_8_0",314]
, [315,"D_8_0",315]
, [316,"D_8_0",316]
, [317,"D_8_0",317]
, [318,"D_8_0",318]
, [319,"D_8_0",319]
, [320,"D_8_0",320]
, [321,"D_8_0",321]
, [322,"D_8_0",322]
, [323,"D_8_0",323]
, [324,"D_8_0",324]
, [325,"D_8_0",325]
, [326,"D_8_0",326]
, [327,"D_8_0",327]
, [328,"D_8_0",328]
, [329,"D_8_0",329]
, [330,"D_11_1",330]
, [331,"D_11_2",331]
, [332,"D_11_3",332]
, [333,"D_11_4",333]
, [334,"D_11_5",334]
, [335,"D_11_0",335]
, [336,"D_11_6",336]
, [337,"D_11_7",337]
, [338,"D_11_8",338]
, [339,"D_11_9",339]
, [340,"D_11_10",240]
, [341,"D_11_11",241]
, [342,"D_11_12",242]
, [343,"D_11_13",243]
, [344,"D_11_14",244]
, [345,"D_11_15",245]
, [346,"D_11_16",246]
, [347,"D_11_17",247]
, [348,"D_11_18",248]
, [349,"D_11_19",249]
, [350,"D_11_20",250]
, [351,"D_11_21",251]
, [352,"D_11_22",252]
, [353,"D_11_23",253]
, [354,"D_11_0",254]
, [355,"D_11_24",255]
, [356,"D_11_25",256]
, [357,"D_11_26",257]
, [358,"D_11_27",258]
, [359,"D_11_28",259]
, [360,"D_12_1",260]
, [361,"D_12_2",261]
, [362,"D_12_3",262]
, [363,"D_12_4",263]
, [364,"D_12_5",264]
, [365,"D_12_0",265]
, [366,"D_12_6",266]
, [367,"D_12_7",267]
, [368,"D_12_8",268]
, [369,"D_12_9",269]
, [370,"D_12_10",270]
, [371,"D_12_11",271]
, [372,"D_12_12",272]
, [373,"D_12_13",273]
, [374,"D_12_14",274]
, [375,"D_12_15",275]
, [376,"D_12_16",276]
, [377,"D_12_17",277]
, [378,"D_12_18",278]
, [379,"D_12_19",279]
, [380,"D_12_20",280]
, [381,"D_12_21",281]
, [382,"D_12_22",282]
, [383,"D_12_0",283]
, [384,"D_12_23",284]
, [385,"D_12_24",285]
, [386,"D_12_25",286]
, [387,"D_12_26",287]
, [388,"D_12_27",288]
, [389,"D_12_28",289]
, [390,"D_13_1",290]
, [391,"D_13_2",291]
, [392,"D_13_3",292]
, [393,"D_13_4",293]
, [394,"D_13_5",294]
, [395,"D_13_0",295]
, [396,"D_13_6",296]
, [397,"D_13_7",297]
, [398,"D_13_8",298]
, [399,"D_13_9",299]
, [400,"D_13_10",300]
, [401,"D_13_11",301]
, [402,"D_13_12",302]
, [403,"D_13_13",303]
, [404,"D_13_14",304]
, [405,"D_13_15",305]
, [406,"D_13_16",306]
, [407,"D_13_17",307]
, [408,"D_13_18",308]
, [409,"D_13_19",309]
, [410,"D_13_20",310]
, [411,"D_13_21",311]
, [412,"D_13_22",312]
, [413,"D_13_23",313]
, [414,"D_13_0",314]
, [415,"D_13_24",315]
, [416,"D_13_25",316]
, [417,"D_13_26",317]
, [418,"D_13_27",318]
, [419,"D_13_28",319]]