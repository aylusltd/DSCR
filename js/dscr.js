;

//globals
var tableData = ["Equipment Loan", "Mortgage", "Line of Credit", "Equipment Line"];
var tableProperties = ["Principal", "Interest", "Term", "Accelerated Pay Down"];
var defaultValues = {
	"EquipmentLoan" : [4100000, 4.125, 60, 0],
	"Mortgage" : [1020000, 4.25, 15*12, 0],
	"LineofCredit" : [1500000, 6.125, 60, 0],
	"EquipmentLine" : [0, 4.125, 60, 0]
}
var $tr, $td, $th, html;
var $table=$("<table id='debtTable'/>");
var $thead=$("<thead />");
var $tbody=$("<tbody />");
var values={};
var iDSCR;

var pDSCR =[];
var pRev=[];
var pDS=[];


function makeTable()
{
	
	
	$tr = $("<tr />");
	
	$th=$("<th />");
	$th.appendTo($tr);
	var pmtArr=[];
	
	for(k2 in tableProperties)
	{
		$th=$("<th />").html(tableProperties[k2]);
		$th.appendTo($tr);
	}
	$th=$("<th />").html("Payment");
	$th.appendTo($tr);
	
	$tr.appendTo($thead);
	
	
	for (key in tableData)
	{
		$tr=$("<tr />");
		$td=$("<td />").html(tableData[key]);
		$td.appendTo($tr);
		//console.log(tableData[key]);
		
		for(k2 in tableProperties)
		{
			
			html = constructHTML(tableData[key], tableProperties[k2]);
			
			$td=$("<td />").html(html);
			$td.appendTo($tr);
			
			
		}
		var pmt = 0;
		var rate = getDefault(tableData[key],"Interest");
		var term = 0;
		var principal = getDefault(tableData[key],"Principal");
		var LOC=true;
		
		LOC=key>1?true:false;
		
		if(LOC)
			pmt = rate * principal/100;
		else
			pmt = (rate /1200 + (rate/1200)/Math.pow((1+rate/1200),term))*principal*12;
			
		pmtArr.push(pmt);
		$("<td />")
			.attr("ID",tableData[key].replace(/ /g,"") + "pmt")
			.addClass("pmt")
			.html("$"+pmt)
			.appendTo($tr);
		$tbody.append($tr);
		
		
	}
	$tr=$("<tr />");
	var debtService = 0;
	for(var i =0; i<pmtArr.length; i++)
		debtService+=pmtArr[i]
	
	$td=$("<th />").html("Total Debt Service");
	$td.appendTo($tr);
	
	for(var i=0;i<4;i++)
		$("<td />").appendTo($tr);
	
	$td=$("<th />")
		.html("$" + debtService)
		.attr("ID","debtService")
		.attr("data-value",debtService);
	$td.appendTo($tr);
	
	$($tbody).append($tr);
	$table.append($thead);
	$table.append($tbody);
	$table.appendTo("#debt");
}

function constructHTML(vString, typeStr)
{
	var str="<input type='number'></input>";
	var labelStr = vString + typeStr;
	labelStr = labelStr.replace(/ /g,"");
	var val=getDefault(vString,typeStr);
	
	switch (typeStr){
		case "Principal":
			//work
			str = "<label for='"+ labelStr +"'>$</label>"
			str += "<input type='number' name='" + labelStr +"' id='" + labelStr + "' min='0' value='"+ val;
			str += "' step='100000' ></input>"
			break;
		case "Interest":
			str = "<input type='number' min='0' step='0.125' value='"+ val +"' class='" + typeStr.replace(/ /g,"");
			str += "' name='" + labelStr + "' id='" + labelStr + "'></input><label for='" + labelStr + "'>%</label>";
			break;
		case "Term":
			str = "<input name='" + labelStr + "' type='number' min='0' class='" + typeStr.replace(/ /g,"") + "'"
			str += "value='" + val + "' id='"+labelStr+"'></input><label for='" + labelStr + "'> months</label>";
			break;
		case "Accelerated Pay Down":
			str = "$<input name='" + labelStr + "' type='number' min='0' class='" + typeStr.replace(/ /g,"") + "'"
			str += "value='"+ val + "' id='"+labelStr+"' step='100000'></input><label for='" + labelStr; 
			str += "'> per year</label>";
			break;
		default :
			
			break;
		
	}
	return str;
}

function getValue(vString, typeStr, array)
{
	var val=0;
	str = vString.replace(/ /g,"");
	if(array == 0)
		arr = defaultValues[str];
	else
		arr = values[str];
		
	switch (typeStr){
		case "Principal":
			val=arr[0]
			break;
		case "Interest":
			val=arr[1]
			break;
		case "Term":
			val=arr[2]
			break;
		case "Accelerated Pay Down":
			val=arr[3]
			break;
		default :
			
			break;
		
	}
	
	return val;
	
}

function getDefault(vString, typeStr)
{
	return getValue(vString, typeStr, 0);
}

function calcDSCR(or,ds)
{
	
	var dscr = Math.floor(or/ds*100)/100;
	
	return dscr; 
}
			
function updateData()
{
	updateDebtService();
	updateRevenue();
	populatedTable();
	makeLineGraph();
	smallScreen();
}

function updateDebtService()
{
	counter=0;
	pmtArr =[];
	$(".pmt").each(function(){
		var id = $(this).attr("ID");
		var str,v;
		id=id.substr(0,id.length-3);
		//["Principal","Interest","Term","Accelerated Pay Down" ]
		values[id]=[];
		
		for(key in tableProperties)
		{
			str=id+tableProperties[key];
			str=str.replace(/ /g,"");
			v=$("#"+str).val();
			values[id].push(v)
			
		}
		
		var pmt = 0;
		
		var rate = getValue(id,"Interest",1);
		var term = getValue(id,"Term",1);
		var principal = getValue(id,"Principal",1);
		var LOC=true;
		var pdown=0+getValue(id,"Accelerated Pay Down",1);
		
		LOC=counter>1?true:false;
		
		if(LOC)
			pmt = (rate * principal/100) + pdown*1;
		else
			pmt = (rate /1200 + (rate/1200)/Math.pow((1+rate/1200),term))*principal*12 + pdown*1;
			
		pmt=Math.floor(pmt*100)/100;
			
		pmtArr.push(pmt);
		counter++;
		
		$("#" + id + "pmt")
			.html("$"+pmt);
	})
	var debtService = 0;
	for(var i =0; i<pmtArr.length; i++)
		debtService+=pmtArr[i]
	debtService = Math.floor(debtService*100)/100;
	$("#debtService")
		.html("$"+debtService)
		.attr("data-value",debtService);
}

function updateRevenue()
{
	var OperatingRevenue = 0;
	OperatingRevenue += $("#GrossRevenue").val() * $("#OperatingMargin").val()/100;
	OperatingRevenue = Math.floor(OperatingRevenue*100)/100;
	
	$("#operatingRev").html("$"+OperatingRevenue).attr("data-value",OperatingRevenue);
	var ogr=(1 + $("#gsgr").val()/100 ) * (1+$("#omgr").val()/100);
	ogr = Math.floor(ogr * 100)/100;
	$("#ogr").html(ogr + "%").attr("data-value",ogr);
	
	iDSCR = calcDSCR($("#operatingRev").attr("data-value"),$("#debtService").attr("data-value"));
	makeBarGraph(iDSCR);
	currencify(); 

}



function makeBarGraph(value)
{
	value+=0;
	
	var maxHeight=50;
	var maxWidth = 17.5;
	var targetMin=1.15;
	var targetMax=1.35;
	
	var maxValue = Math.max(Math.ceil(targetMax),Math.ceil(value + 1));
	var minValue = Math.min(0,Math.floor(value));
	
	var range = maxValue - minValue;
	var threshhold = 2.5;
	
	var targetHeight = Math.max((targetMax-targetMin)/range, threshhold);
	var centered = targetMax-targetMin/range < threshhold;
	
	var barHeight = value / range;
	
	var extraLine=minValue<0;
	
	//draw ten grid lines
	var $gl, $label, top;
	$(".bLabel").remove();
	$(".gl").remove();
	var zeroHeight = (0-minValue) / range;
	
	for(var i=9;i>=0;i--)
	{
		$gl=$("<div />").addClass("gl").css("top",(i+1)*10+"%");
		$gl.appendTo("#plotArea");
		
		top=$gl.position().top;
		
		$label=$("<span />")
			.html((9-i)*range/10+minValue)
			.css("top",top-8 + "px")
			.addClass("bLabel");
			
		$label.appendTo("#bgBackground");
		
	}
	
	if(extraLine)
	{
		//draw eleventh
		
		$gl=$("<div />").addClass("gl").css("top",zeroHeight+"%");
		$gl.appendTo("#plotArea");
		
	}
	//Draw Bar
	var bar=$("#bgBar");
		
		
	
	if(value<0)
	{
		bar.top(zeroHeight+"%");
		
	}
	else
	{
		bar.css("bottom",0);
		
	}
	
	var target = $("#bgTarget").css("height",targetHeight+"%");
	if(centered)
	{
		var centerPoint=100+threshhold/2-(targetMax+targetMin)/(2*range)*100;
		target.top(centerPoint+"%");
	}
	else
	{
		target.top((100-targetMax/range*100)+"%");
		
	}
	
	bar.animate({"height" : (barHeight * 100)+"%"});
	$("#bgVal").html(Math.floor(value*1000)/1000);
	
}
function makedTable()
{
	var tr, td;
	var table = $("#dTable");
	
	
	
	//header
	tr=$("<tr />");
	td=$("<th/>").html("Year");
	tr.append(td);
	td=$("<th/>").html("DSCR");
	tr.append(td);
	table.append(tr)
	
	//body
	
	for(var i=0;i<6;i++)
	{
		tr=$("<tr />");
		td=$("<td/>").html(i);
		tr.append(td);
		td=$("<td/>")
			.attr("id","DSCR" + i);
		tr.append(td);
		table.append(tr)
	}
}

function populatedTable()
{
	var str;
	pDSCR = [];
	pDSCR.push(iDSCR);
	
	projectRevenue();
	projectDebtService();
	
	for(i=1; i<6; i++)
		pDSCR.push(Math.floor(pRev[i]/pDS[i]*1000)/1000);
	
	for(i=0;i<6;i++)
	{
		str=pDSCR[i] + "";
		
		
		if(str.search(/\./)<0)
			str+=".";
		while(str.length<5)
			str+="0";
			
		$("#DSCR"+i).html(str)
	}
		
	
}

function projectRevenue()
{
	pRev[0]=$("#operatingRev").attr("data-value");
	var pGR = $("#ogr").attr("data-value")/100; 
	
	for(var i=1; i<6; i++)
		pRev[i]=(1+pGR)*pRev[i-1];
}

function projectDebtService()
{
	var projectedDebt, LOCincrease; 
	for(var i=0; i<6; i++)
	{
		projectedDebt = $("#debtService").attr("data-value")*1 
		
		
		
		LOCincrease = Math.pow(1+$("#gsgr").val()/100,i+1)*$("#LineofCreditPrincipal").val()*.6-$("#LineofCreditAcceleratedPayDown").val();
		
		
		projectedDebt += LOCincrease*$("#LineofCreditInterest").val()/100;
		
		pDS[i]=projectedDebt;
	}
}

function main()
{
	makeTable();
	updateRevenue();
	
	$("input").change(function(){updateData()});
	makedTable();
	populatedTable();
	makeLineGraph();	
}


function currencify()
{
	$("#debtService").currencify();
	$(".pmt").currencify();
	$("#operatingRev").currencify();
}


function makeLineGraph()
{
	
	$("svg").remove(); 
	
	var arr=pDSCR;
	var h=0;
	
	for(var i =0 ; i<arr.length; i++)
	{
		h=h>arr[i]?h:arr[i];
	}
	
	h=h>1.35?h:1.35;
	
	stressed={};
	var stressor=0;
	var x=0;
	//stress lines
	for(i=0; i<3; i++)
	{
		
		stressed[i]=[];
		for(var j =0 ; j<arr.length; j++)
		{
			
			stressor= 1 - ((i+1)/10);
			x=pRev[j]*stressor/pDS[j];
			x=Math.floor(x*1000)/1000;
			stressed[i].push(x);
		}
		stressed[i][0]=arr[0];
	}
	
	h=Math.ceil(h)+2;
	
	var str=""
	
	
	var w = arr.length+1;
	var svg=$("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 "+ w +" "+ h +"' preserveAspectRatio='none'/>");
	$("#lineGraph").append(svg);
	
	
	
	
		
	svg.css(
		{
			height:"100%",
			width:"100%",
			"background-color" : "white"
		}
	);
	
	for(var i=-1; i<10; i++)
	{
		//Lines
		var y=(h- (i+1)*(h-2)/10-1)
		
		str=  "1, " + y + " ";
		str+= w-1 + "," + y;
		
		
		d3.select("svg")
			.append("polyline")
			.attr("points",str)
			.attr("style", "stroke:black; stroke-width:" + h/300);
			
		//Labels
		d3.select("svg")
			.append("text")
			.attr("style","font-size:" + (h-2)/20 + "px")
			.attr("x", 0.75)
			.attr("y", y)
			.text((h-2)*(i+1)/10);
			
			
	}
	
	//Y axis
	for(i=0;i<w-1;i++)
	{
		var x=i+1;
		
		str=  x + ",1 ";
		str+= x + "," + (h-1) + " ";
		
		
		d3.select("svg")
			.append("polyline")
			.attr("points",str)
			.attr("style", "stroke:black; stroke-width:" + h/300);
			
		//Labels
		d3.select("svg")
			.append("text")
			.attr("style","font-size:" + (h-2)/20 + "px")
			.attr("x", x)
			.attr("y", h-.75)
			.text(i);
	}
	
	str="";
	for(var i =0; i<arr.length; i++)
	{
		str+= (i+1) + "," + (h -(arr[i])-1) + " ";
	}
	
	
	d3.select("svg").append("polyline").attr("points",str).attr("style","stroke-width:" + h/80);
	
	d3.select("svg")
			.append("text")
			.attr("style","font-size:" + (h-2)/20 + "px; fill:green")
			.attr("x", arr.length + 0.125)
			.attr("y", h - arr[arr.length-1] -1)
			.text("Projected");
	
	var strArr = [];
	for(i=0;i<3;i++)
	{
		strArr[i]="";
		for(j=0;j<stressed[i].length;j++)
		{
			strArr[i] += (j+1) + "," + (h -(stressed[i][j])-1) + " ";
		}
		
		rgbStr = rgb(2 - i);
		
		d3.select("svg")
			.append("polyline")
			.attr("points", strArr[i])
			.attr("style","stroke-width:" + h/80 + "; stroke:" + rgbStr);
			
		d3.select("svg")
			.append("text")
			.attr("style","font-size:" + (h-2)/20 + "px; fill:" + rgbStr)
			.attr("x", arr.length + 0.125)
			.attr("y", h - stressed[i][arr.length-1] -1)
			.text((i+1)*10 + "% Stressed");
				
		
	}
	
	
	str=  "1, " + (h-2.25) + " ";
	str+= w-1 + "," + (h-2.25);
	
	var targetWidth = Math.max(.2/h,h/150);
	
	d3.select("svg")
		.append("polyline")
		.attr("points",str)
		.attr("style", "stroke:green; stroke-opacity:0.5; stroke-width:" + targetWidth);
	
	
	
		
	svgProps = {
		dimensions : 
			{
				h:h,
				w:w
			}
	};
	
}

function rgb(i)
{
	var r = 15 - ( i * 5);
	var g = i*5;
	var b = 0;
	
	r>16||r<0?r=0:null;
	g>16||g<0?g=0:null;
	b>16||b<0?b=0:null;
	
	r>9?r=String.fromCharCode(87+r):null;
	g>9?g=String.fromCharCode(87+g):null;
	b>9?b=String.fromCharCode(87+g):null;
	
	
	
	var str = "#" + r + g + b;
	
	return str;
}


function smallScreen()
{
	var s={};
	s.bWT = $("#bottomWrapper").position().top;
	s.tWH = $("#topWrapper").css("height")
	s.tWH = s.tWH.slice(0,-2);
	s.tWH = s.tWH * 1;
	s.tWT = $("#topWrapper").offset().top;

	
	if(s.bWT < s.tWH + s.tWT)
	{

		$("#bottomWrapper").top(Math.floor(s.tWH+ s.tWT) + "px");
	}
	if(s.bWT> s.tWH + s.tWT + 1 )
	{
		$("#bottomWrapper").top(Math.floor(s.tWH + s.tWT) + "px");
	}
	
	var hStr = $("#topWrapper").css("height");
	hStr = hStr.slice(0,-2);
	hStr = hStr *1;
	hStr -=2;
	
	hStr = hStr < 220 ? 220 : hStr;
	$("#topWrapper>div").css("height",hStr+"px");
	
	hStr = $("#bottomWrapper").css("height");
	
	hStr = hStr.slice(0,-2);
	hStr = hStr *1;
	hStr -=2;
	hStr = hStr<410?410:hStr;
	$("#bottomWrapper>div").css("height",hStr+"px");

}


main();
smallScreen();
window.onresize=updateData;
