var isLoggedin = false;
var element = document.getElementById("large-feed");
element.innerHTML = '<p id="token" class="d-none"></p>';
element.innerHTML += '<form id="register" class="register container col-md-4 d-none"><h1 class="text-center mb-5 mt-5">Register</h1><div class="row mb-4"><div class="col-md-4 text-right align-self-center">User Name</div><div class="col-md-8"><input class="form-control" name="username" type="text"></div></div><p class="text-right text-danger" id="error_username"></p><div class="row mb-4"><div class="col-md-4 text-right align-self-center">Name</div><div class="col-md-8"><input class="form-control" name="name" type="text"></div></div><div class="row mb-4"><div class="col-md-4 text-right align-self-center">Email</div><div class="col-md-8"><input class="form-control" name="email" type="email"></div></div><div class="row mb-4"><div class="col-md-4 text-right align-self-center">Password</div><div class="col-md-8"><input class="form-control" name="password" type="password"></div></div><p class="text-right text-danger" id="error_password"></p><div class="row mb-4"><div class="col-md-12 text-right"><a class="btn btn-primary" href="javascript:registerSubmit()">Register</a></div></div><div class="row mb-4"><div class="col-md-12 text-right"><span class="text-right align-self-center">If you have an account? Then go to<a href="javascript:;" class="gotoLogin"> Log in</a></span></div></div></form>';
element.innerHTML += '<form id="login" class="login container col-md-4"><h1 class="text-center mb-5 mt-5">Log in</h1><div class="row mb-4"><div class="col-md-4 text-right align-self-center">User Name</div><div class="col-md-8"><input class="form-control" name="username" type="text"></div></div><div class="row mb-4"><div class="col-md-4 text-right align-self-center">Password</div><div class="col-md-8"><input class="form-control" name="password" type="password"></div></div><p class="text-right text-danger" id="error"></p><div class="row mb-4"><div class="col-md-12 text-right"><a class="btn btn-primary" type="button" href="javascript:loginSubmit()">Log in</a></div></div><div class="row mb-4"><div class="col-md-12 text-right"><span class="text-right align-self-center">If you do not have an account? Then go to<a class="gotoRegister" href="javascript:;"> Register</a></span></div></div></form>';
element.innerHTML += '<div class="feeds container d-none"><div class="mb-3 mt-3 text-center"><button class="btn btn-success" onClick="logout()">Log out</button></div><h1 class="text-center mb-5 mt-5">Feeds</h1></div>';
// when click go to register button
var goToRegisterBtn = document.getElementsByClassName("gotoRegister");
document.getElementsByClassName("gotoRegister")[0].addEventListener("click", displayRegisterForm);

function displayRegisterForm() {
    document.getElementsByClassName("login")[0].classList.add("d-none");
    document.getElementsByClassName("register")[0].classList.remove("d-none");
}
// when click go to login button
var goToLoginBtn = document.getElementsByClassName("gotoLogin");
document.getElementsByClassName("gotoLogin")[0].addEventListener("click", displayLoginForm);

function displayLoginForm() {
    document.getElementsByClassName("register")[0].classList.add("d-none");
    document.getElementsByClassName("login")[0].classList.remove("d-none");
}

function displayFeeds() {
    document.getElementsByClassName("login")[0].classList.add("d-none");
    document.getElementsByClassName("feeds")[0].classList.remove("d-none");
    getFeeds();
}
var xmlhttp = new XMLHttpRequest();

function registerSubmit() {
    var username = document.getElementsByClassName("register")[0].getElementsByTagName("input")[0].value;
    var name = document.getElementsByClassName("register")[0].getElementsByTagName("input")[1].value;
    var email = document.getElementsByClassName("register")[0].getElementsByTagName("input")[2].value;
    var password = document.getElementsByClassName("register")[0].getElementsByTagName("input")[3].value;
    var url = "http://127.0.0.1:5000/auth/signup";
    xmlhttp.onreadystatechange = registerStateChange;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        "username": username,
        "name": name,
        "email": email,
        "password": password
    }));
}

function registerStateChange() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == "200") {
        document.getElementById("error_username").innerHTML = "";
        document.getElementById("error_password").innerHTML = "";
        window.alert("You are registered successfully.");
        displayLoginForm();
    } else {
        var message = JSON.parse(xmlhttp.responseText).message;
        if (message == "Username Taken") {
            document.getElementById("error_username").innerHTML = "That username is already taken. Try another.";
            document.getElementById("error_password").innerHTML = "";
        } else if (message == "Password cannot be empty") {
            document.getElementById("error_username").innerHTML = "";
            document.getElementById("error_password").innerHTML = "Password is needed.";
        }
    }
}

function loginSubmit() {
    var username = document.getElementsByClassName("login")[0].getElementsByTagName("input")[0].value;
    var password = document.getElementsByClassName("login")[0].getElementsByTagName("input")[1].value;
    var url = "http://127.0.0.1:5000/auth/login";
    xmlhttp.onreadystatechange = loginStateChange;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        "username": username,
        "password": password
    }));
}

function loginStateChange() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == "200") {
        document.getElementById("token").textContent = JSON.parse(xmlhttp.responseText).token;
        document.getElementById("error").innerHTML = "";
        window.alert("You are logged in successfully.");
        displayFeeds();
    } else {
        var message = JSON.parse(xmlhttp.responseText).message;
        if (message == "Invalid Username/Password") {
            document.getElementById("error").innerHTML = "Username or password is incorrect.";
        }
    }
}

function getFeeds() {
    var token = document.getElementById("token").textContent;
    var url = "http://127.0.0.1:5000/user/feed";
    xmlhttp.onreadystatechange = feedStateChange;
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader('Authorization', "Token " + token);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
}

function feedStateChange() {
    // 	var token = document.getElementById("token").textContent;
    //     var url = "http://127.0.0.1:5000/user/follow?username=Ellie";
    // //    xmlhttp.onreadystatechange = feedStateChange;
    //     xmlhttp.open("PUT", url, true);
    //     xmlhttp.setRequestHeader('Authorization', "Token " + token);
    //     xmlhttp.setRequestHeader("Content-Type", "application/json");
    //     xmlhttp.send();
    var len = JSON.parse(xmlhttp.responseText).posts.length;
    var all_posts = JSON.parse(xmlhttp.responseText).posts;
    var feedElement = document.getElementById("large-feed").getElementsByClassName("feeds")[0];
    for (var i = 0; i < len; i++) {
        var post = all_posts[i];
        feedElement.innerHTML += '<div class="mb-3 mt-3"><div class="row mb-4"><img class="thumbnail" src="https://tpc.googlesyndication.com/simgad/10507322696753466438" class="col-md-4" style="height: 250px;"><div class="col-md-8"><p>posted by <span class="posted_by">simba</span></p><p>posted date <span class="posted_date">Date</span></p><p>description : <span class="description">this is description</span></p><p>likes <span class="likes">23</span></p><p>comments <span class="comments">30</span></p></div></div></div>';
        feedElement.getElementsByClassName("thumbnail")[i].src = 'data:image/png;base64,'+post.src;
        feedElement.getElementsByClassName("posted_by")[i].textContent = post.meta.author;
        feedElement.getElementsByClassName("posted_date")[i].textContent = post.meta.published;
        feedElement.getElementsByClassName("description")[i].textContent = post.meta.description_text;
        feedElement.getElementsByClassName("likes")[i].textContent = post.meta.likes;
        feedElement.getElementsByClassName("comments")[i].textContent = post.comments.length;
    }
    if (xmlhttp.readyState == 4 && xmlhttp.status == "200") {
        document.getElementById("error").innerHTML = "";
    } else {}
}

function logout() {
    document.getElementById("token").textContent = "";
    document.getElementsByClassName("login")[0].classList.remove("d-none");
    document.getElementsByClassName("feeds")[0].classList.add("d-none");
}