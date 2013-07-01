;
//Via Crockford
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function (parent) {
    this.prototype = new parent();
    var d = {}, 
        p = this.prototype;
    this.prototype.constructor = parent; 
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }        
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    });
    return this;
});

Function.method('swiss', function (parent) {
    for (var i = 1; i < arguments.length; i += 1) {
        var name = arguments[i];
        this.prototype[name] = parent.prototype[name];
    }
    return this;
});

//End Crockford

(function ($){
	$.fn.top = function top(top)
	{
		
		if(top)
		{
			this.css("top",top);
			return this;
		}
		else
		{
			return this.css("top");
		}
		
		
		
	}
})(jQuery);

(function($){
	$.fn.currencify = function()
	{
		this.each(function(){	
			var start=$(this).html()+"";
			if(start.search(/[A-Z],[a-z] /)<1)
				console.log("No letters");
			var str1, str2;
			if(start.charAt(0) == "$")
				start = start.substr(1,start.length)
			
			if(start.search(/\./)<0)
			{
				//no decimal
				
				start+=".00";
			}
			if(start.length>6)
			{
				//add commas
				counter = start.length;
				var counterspot = 6;
				while(counter>6)
				{
					
					
					str1=start.substr(0,start.length-counterspot)
					str2=start.substr(start.length-counterspot,start.length);
					start = str1+ "," + str2;
					
					counterspot+=4;
					counter-=3;
				}
			}
			
			$(this).html("$"+start);
		});
	}
	return this;
})
(jQuery);

(function($,d3){
	$.fn.appendSVG = function appendSVG(target)
	{
		
		$(this).each(function(){
			if($(this).attr("id") != undefined)
				d3.select("#" + $(this).attr("id")).append(target);
			else
				d3.select($(this)[0]).append(target);
		})
	}
	
	this.attr = d3.selection.prototype.attr;
	
	return this;
})(jQuery,d3);


(function($,d3){
	$.fn.appendGraph = function appendGraph(argument)
	{
		
		
		if(typeof argument == "object")
		{
			if(typeof argument.sort == "undefined")
			{
				//Object
			}
			else
			{
				//Array
			}
		}
		
		var barCSS = {
				"background-color"	:	"#0000E0",
				"width"				:	"50%",
				"position" 			: 	"absolute",
				"left" 				: 	"25%",
				"z-index"			: 	10
			}
		
		function barGraph(value)
		{
			
			
			var value = argument;
	
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
				
				top=$gl.offset().top;
				
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
		
		
		
		if(typeof argument == "number")
		{
			barGraph(argument);
		}
	}
})(jQuery,d3);

(function ($,d3){
	j3 = function(selector)
	{
		j3.fn = function(){return this};
		
		var x=0;
		var y;
		$(selector).each(function(){
			var svg  = $(this).is("svg") || $(this).parents().is("svg") && !$(this).is("div, span");
			svg? x++:null;
			
		});
		
		if(x>0)
		{
			//j3.fn = ;
			//j3.fn.inherits($);
			y = function(selector){d3.select(selector)}
			y.inherits($);
			return y;
		}
		
		//x>0? y=d3.select(selector) : y=$(selector);
		
		
		return y;
		
		//return j3(selector);
		j3.fn.inherits($);
		j3.fn.inherits(d3.selection);
		return j3.fn(selector);
		
	}
	
	
	
	
})(jQuery,d3)
