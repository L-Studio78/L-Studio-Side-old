
var objPeople = [
	{ // Object @ 0 index
		username: "Niklas Lennartz",
		password: "nik987!123"
	},
	{ // Object @ 1 index
		username: "Julian Lennartz",
		password: "Flairlennartz123!"
	},
	{ // Object @ 0 index
		username: "Niklas Lennartz",
		password: "nik987!123"
	},


]

function getInfo() {
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value

	for(var i = 0; i < objPeople.length; i++) {
		// check is user input matches username and password of a current index of the objPeople array
		if(username == objPeople[i].username && password == objPeople[i].password) {
			console.log(username + " is logged in!!!")
            window.location.href = 'Mitarbeiter.html';
			// stop the function if this is found to be true
			return
		}
	}
	console.log("incorrect username or password")
	alert("Es wurde ein falsches Passwort oder Benutzername eingegeben.")
}