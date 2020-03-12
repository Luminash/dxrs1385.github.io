var Debug = false;
var MainApp = angular.module('Main', ['ngSanitize']);

var jsonFileName = "cookie";
var ColorList = [ "#F9F9F9" , "#FEDFE1", "#d4e9c9" , "#cce7ff" , "#fed9b9" , "#fdf2c4"  , "#e0d8ee"];

var JSONData = {

	"cookie" : {
					
		"Title" : "餅嗜者 團務LOG",

		"Player" : 	{"U08CREWG0" : "GM(TRPG.S)" , 
					"U08DT8GG6" :  "谷奈(aaaa)" , 
					"U08ECDMPU" :"安貝蒂(-ˊㄑ_ˋ-)" ,
					"U08DTBKEU" : "科索夫(黃粱一)",
					"U08DSE53M" : "觀眾(崩壞)"
		},

		"RoomColor" : ["G09FS1XPC","D08DT8GH4","D08DTLRAM","D08ECDMT4"]
	},

	"20151121" : {
		"Title" : "小夫鴨的惡夢 團務LOG",

		"Player" : 	{"U08CREWG0" : "GM(TRPG.S)" , 
					"U08DTBKEU" : "左是良(黃粱一)",
					"U08DSE53M" : "林雨凜(崩壞)",
					"U08DTAD1B" : "鬼華院狂龍(貓弟)",
					"U0E9WBLE6" : "曹爽德(神父)",
					"U0EKF959R" : "蕭齊德(Ocean)",
					"U0EKGLV2R" : "樊彩悠(悠子)"
		},

		"RoomColor" : ["G0EKGMN8P","D08DTLRAM"]
	}
}

$("body").keydown(function(e){
    if(e.keyCode == 37)
    {
    	$(".messages").scope().LastPage();
    	$(".messages").scope().$apply();
    }
   	else if(e.keyCode == 39)
   	{
   		$(".messages").scope().NextPage();
   		$(".messages").scope().$apply();
   	}
});

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

String.prototype.padleft = function (n, c) {
	var s = "";
	n = n - this.length;
    while (n-- > 0) s += c;
	return s + this;};


Number.prototype.w2 = function () {
	return this.toString().padleft(2, '0');
}

MainApp.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});

var ImageList = {};
MainApp.filter('img' , function () { 
	return function img(input) 
	{
		var path = 'img/'+jsonFileName+'/';
		if(input)
		{
			if(input.user)
				return path+input.user+".png";
			else if(input.bot_id)
			{
				return path+input.icons.emoji.substr(1,input.icons.emoji.length-2)+".png";
			}
			else
				return "img/Unknow.png";
		}
		else
			return "";
		
	};
});

MainApp.filter('room_bg' , function () { 
	return function room(input) 
	{
		if(input)
		{
			var index = JSONData[jsonFileName]["RoomColor"].indexOf(input);
			if(index != -1)
				return ColorList[index];
			else
				return ColorList[0];
		}
		else
			return ColorList[0];
	};
});

MainApp.filter('room_brg' , function () { 
	return function room(input) 
	{
		if(input)
		{
			var index = JSONData[jsonFileName]["RoomColor"].indexOf(input);
			if(index != -1)
				return ColorList[index] + " 5px solid";
			else
				return ColorList[0] + " 5px solid";
		}
		else
			return ColorList[0] + " 5px solid";
	};
});

MainApp.filter('name' , function () { 
	return function name(input) 
	{
		if(input)
		{
			if(input.user)
				return JSONData[jsonFileName]["Player"][input.user] ? JSONData[jsonFileName]["Player"][input.user] : input.user;
			else if(input.bot_id)
				if(Debug)
					return input.icons ? input.username + "(" + input.icons.emoji.substr(1,input.icons.emoji.length-2) + ")" : input.username;
				else
					return input.username;
		}
		else
			return "NaN";

		if(input.bot_id)
			return ""
		return JSONData[jsonFileName]["Player"][input] ? JSONData[jsonFileName]["Player"][input] : input;
	};
});

MainApp.filter('time' , function () { 
	return function time(input) 
	{
		var d = new Date(input * 1000);
		return  d.getFullYear() + "-" +  (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours().w2() + ":" + d.getMinutes().w2();
	};
});

MainApp.filter('text' , function () { 
	return function text(data) 
	{
		if(!data)
			return "NaN";

		var ret = "";
		var input = data.text;

		//for tmp
		input = input.replaceAll("<" , "");
		input = input.replaceAll(">" , "");
		

		var line = input.split("\n");

		for(var i = 0 ; i < line.length ; i++)
		{
			if(line[i].substr(0,4) == "&gt;")
				ret += "<div class='sub'>" + line[i].substr(4) + "</div>";
			else
				ret += line[i]+"<br>";
		}

		if(ret.substr(ret.length - 4) == "<br>")
			ret = ret.substr(0 , ret.length - 4);

		ret = ret.replace(/```[^<]*```/g , function outer(input) {
			return "<div class='outer'>"+input.substr(3,input.length - 6)+"</div>";
		});
		ret = ret.replace(/\s`[^\s`]*`\s/g , function code(input) {
			return "<span class='code'>"+input.substr(2,input.length - 4)+"</span>";
		});
		ret = ret.replace(/^`[^\s`]*`/g , function code(input) {
			return "<span class='code'>"+input.substr(1,input.length - 2)+"</span>";
		});
		ret = ret.replace(/\s\*[^\*]*\*\s/g , function strong(input) {
			return "<strong>"+input.substr(2,input.length - 4)+"</strong>";
		});
		ret = ret.replace(/^\*[^\*]*\*/g , function strong(input) {
			return "<strong>"+input.substr(1,input.length - 2)+"</strong>";
		});
		ret = ret.replace(/\s_[^\*]*_\s/g , function italic(input) {
			return "<i>"+input.substr(2,input.length - 4)+"</i>";
		});
		ret = ret.replace(/^_[^\*]*_/g , function italic(input) {
			return "<i>"+input.substr(1,input.length - 2)+"</i>";
		});
		ret = ret.replace(/\s~[^\*]*~\s/g , function del(input) {
			return "<del>"+input.substr(2,input.length - 4)+"</del>";
		});
		ret = ret.replace(/^~[^\*]*~/g , function del(input) {
			return "<del>"+input.substr(1,input.length - 2)+"</del>";
		});

		for(n in JSONData[jsonFileName]["Player"])
			ret = ret.replaceAll( n , JSONData[jsonFileName]["Player"][n]);

		if(ret.regexIndexOf(/\s{0,1}\*[^\*]*\*\s{0,1}/) > 0)
			ret = ret.replaceAll("*" , "");

		return ret;
	};
});


MainApp.controller('Main-Controller', function($timeout , $scope) {
	$scope.Title = "Title HERE";
	$scope.Data = [];
	$scope.index = -1;
	$scope.TotalPages = -1;
	$scope.DataPerPage = 10;

	$scope.Reflesh = function () {
		$(".loading").fadeIn(320);
		$.getJSON(jsonFileName+ ".json", function(json) {
		    $scope.Data = json;
		    $scope.TotalPages = ($scope.Data.length % $scope.DataPerPage) == 0 ? ($scope.Data.length / $scope.DataPerPage) : (Math.floor($scope.Data.length / $scope.DataPerPage) + 1);
		    $scope.index = 0;
		    $scope.Title = JSONData[jsonFileName]["Title"];
		    $(".loading").fadeOut(320);
		    $scope.$apply();
		});
	}

	$scope.ReadJSON = function(i_json) {
		jsonFileName = i_json;
		$scope.Reflesh();
	}

	$scope.getData = function () {
		var val = $scope.DataPerPage;
		if($scope.Data.length - val * $scope.index > val)
		{
			var ret = [];
			var st = val * $scope.index;
			for(var i = 0; i < val ; i ++)
				ret.push($scope.Data[i + st]);
			return ret;
		}
		else
		{
			var ret = [];
			for(var i = val * $scope.index; i < $scope.Data.length ; i++)
				ret.push($scope.Data[i]);
			return ret;
		}
	}

	$scope.NextPage = function () {
		$scope.index = ($scope.index + 1) >= $scope.TotalPages ? $scope.index : ($scope.index + 1);
		ScrollUp();
	}

	$scope.LastPage = function () {
		$scope.index = ($scope.index - 1) < 0 ? 0 : ($scope.index - 1);
		ScrollUp();
	}

	$scope.ReCalcPage = function() {
		$scope.TotalPages = ($scope.Data.length % $scope.DataPerPage) == 0 ? ($scope.Data.length / $scope.DataPerPage) : (Math.floor($scope.Data.length / $scope.DataPerPage) + 1);
	}

	$scope.jumpto = 1;
	$scope.Jump = function () {
		$scope.index = $scope.jumpto - 1;
		ScrollUp();
	}

	$scope.CheckJump = function () {
		if($scope.jumpto > $scope.TotalPages)
			$scope.jumpto = $scope.TotalPages;
		else if($scope.jumpto <= 0)
			$scope.jumpto = 1;
	}

	$scope.numList = function () {
		var val = $scope.DataPerPage;
		var ret = [];
		for(var i = 0 ; i < val ; i ++)
			ret.push(i);

		return i;
	}

	function ScrollUp() {
		var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
		$body.stop( true, true ).animate({
			scrollTop: 0
		}, 16 * 30);
	}

	$timeout(function () {
		$scope.Reflesh();
	})

	$scope.getNumList = function () {
		var ret = [];
		var colnum = $scope.Data.length - $scope.DataPerPage * $scope.index > $scope.DataPerPage ? $scope.DataPerPage : $scope.Data.length - $scope.DataPerPage * $scope.index;

		for(var i = 0 ; i < colnum ; i++)
			ret.push(i);
		return ret;
	}
});


MainApp.controller('JSON_Selecter', function($timeout , $scope) {
	$scope.JsonList = ["cookie" , "20151121"];
	$scope.index = 0;
	$scope.total = 0;

	$scope.Click = function (name) {
		$(".messages").scope().ReadJSON(name);
	}

	$scope.getNumList = function () {
		var ret = [];
		var colnum = $scope.JsonList.length - 10 * $scope.index > 10 ? 10 : $scope.JsonList.length - 10 * $scope.index;

		for(var i = 0 ; i < colnum ; i++)
			ret.push(i);
		return ret;
	}

	$scope.getName = function (name) {
		return JSONData[name] ? JSONData[name]["Title"]  : name;
	}

	$scope.NextPage = function () {
		$scope.index = ($scope.index + 1) >= $scope.total ? $scope.index : ($scope.index + 1);
		ScrollUp();
	}

	$scope.LastPage = function () {
		$scope.index = ($scope.index - 1) < 0 ? 0 : ($scope.index - 1);
		ScrollUp();
	}

	$timeout(function () {
		$scope.total = $scope.JsonList.length % 10 == 0 ? $scope.JsonList.length / 10 : Math.floor($scope.JsonList.length / 10) + 1;
	})
});
