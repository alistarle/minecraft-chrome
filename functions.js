// Javascript functions for webapp

//On document event triggers scripts
$(document).ready(function(e){
	getData();
	setupEvents();
});

function setupEvents() {
	
	$("input").click(function(e) {
		var value = e.target.defaultValue;
		if (value == "Username") {
			$("input:first").select();
		}
		else if (value == "Password") {
			$("input:last").select();
		}
	});
	
	$("#play a").click(function(e){
		$('#login').slideToggle("slow");
		$('[name="savepassword"]').click(function(e){
			var isActive = $("[name='savepassword']:checked").val();
				if (isActive == 'on') {
					alert("Storing your password won't be completely safe, continue on own risks.");
				}
		});
	});
	
	$("[name='login']").click(function(e){
			getLogin();
	});
	
	$("#removeLogin").click(function(e){
		removeLogin();
	});
	
	$("#fullscreenbutton").click(function(e){
		fullscreen();
	});
	
}

function getData() {
	
	if (checkOnline() == false){	
		offline();
		return;
	}
	
	chrome.storage.sync.get('username',function(result){
		var username = result.username;
			if (username) {
				$("[name='username']").val(username);
			}
	});
	
	chrome.storage.sync.get('password',function(result){
		var password = result.password;
			if (password) {
				$("[name='password']").val(password);	
			}
	});	
}

function getLogin() {
		
	var saveusername = $("[name='saveusername']:checked").val();
	var username = $("[name='username']").val();
	var savepassword = $("[name='savepassword']:checked").val();
	var password = $("[name='password']").val();
	
	if (username == null || password == null || username == "Username" || password == "Password") {
		alert("You didn't fill in any account details or left the default information in!");
		return;
	}
	
	if (saveusername == "on") {
		chrome.storage.sync.set({'username':username});	
	}
	
	if (savepassword == "on") {
		chrome.storage.sync.set({'password':password});	
	}
}

function authLogin(u,p) {
	
	var link = 'http://login.minecraft.net/?user=' + u + '&password=' + p +'&version=69';
	$.get(link,function(e){
		var auth = e.split(':');	
		if (auth[0] == "Account migrated, use e-mail as username.") {
			alert(auth[0]);
		}
		else if (auth[0] == "Bad login") {
			alert("Bad login: please check your Minecraft login information again.");
		}
		else {
			buildMinecraft(auth);
		}
	});
	console.log(link);
}

function buildMinecraft(e) {
	
	var link = "http://dev.hexlime.tk/projects/minecraft/auth.php/?u=" + e[2] + "&v=" + e[0] + "&s=" + e[3] + "&d=" + e[4];
	console.log(link);
	$("#iframe").attr("src",link);
}

function checkOnline() {
	
	var online = navigator.onLine
	return online;
}

function offline() {
	
	$("ul#login").html("<h4>You're offline.</h4><br><h5>Wanna play offline?</h5><br><h5>This will be available in the future.</h5>");	
}

function removeLogin() {
		
		chrome.storage.sync.remove('username');
		chrome.storage.sync.remove('password');
		$("[name='username']").val("Username");
		$("[name='password']").val("Password");
		
		alert("Removed all of your info stored by this application");
}

function fullscreen() {
	
	if ($("#fullscreenbutton").hasClass("removefullscreen") == true) {
		$("#fullscreenbutton").fadeOut(1000,function(e){
			$("#fullscreenbutton").removeClass('removefullscreen');
			$("#fullscreenbutton").remove();
			$("#menubg").prepend('<div id="fullscreenbutton" class="gofullscreen">Go fullscreen.</div>');
				$("#header").slideDown(1500);
				$("#iframe").animate({"width":"55%",height:"90%",marginTop:"102px"},1500,function(e){
					$("#menubg").slideDown(1500);
				});
			$("#fullscreenbutton").click(function(e){
				fullscreen();
			});
		});
	}
	else {
		$("#menubg").slideUp(1500,function(e){
				$("#fullscreenbutton").removeClass('gofullscreen');
				$("#fullscreenbutton").remove();
				$("body").before("<div id='fullscreenbutton' class='removefullscreen'>X</div>");
					$("#header").slideUp(1500);
					$("#iframe").animate({width:"100%",height:"100%",marginTop:"0px"},1500,function(e){
						$(".removefullscreen").fadeIn("fast");
							$(".removefullscreen").click(function(e){
								fullscreen();
							});
					});
		});
	}
}