"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
    $("#fileinput").change(calculate);
});

function calculate(evt) {
    var f = evt.target.files[0]; 

    if (f) {
	var r = new FileReader();
	r.onload = function(e) { 
	    var contents = e.target.result;
	    
	    var tokens = lexer(contents);
	    var pretty = tokensToString(tokens);
	    console.log("pasa");
	    out.className = 'unhidden';
	    initialinput.innerHTML = contents;
	    finaloutput.innerHTML = pretty;
	}
	r.readAsText(f); // Leer como texto
    } else { 
	alert("Failed to load file");
    }
}

var temp = '<li> <span class = "<%= t.type %>"> <%= s %> </span>\n';

function tokensToString(tokens) {
    alert(tokens.length);
    var r = '';
    for(var i in tokens) {
	var t = tokens[i];
	var s = JSON.stringify(t, undefined, 2);
	s = _.template(temp, {t: t, s: s});
	r += s;
    }
    return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
    var blanks         = /^\s*(?:\n|$)/;
    var iniheader      = /^\[\w+\](?:\n|$)/;
    var comments       = /^;.*?(?:\n|$)/;
    var nameEqualValue = /^[^\s=]*?\s*=\s*.*?(?:\n|$)/;
    var any            = /^.*(?:\n|$)/;

    var out = [];
    var m = null;

    while (input != '') {
	if (m = blanks.exec(input) ) {
	    input = input.substr(m.index+m[0].length);
	    out.push({ type : "Blancos", match: m });
	}
	else if (m = iniheader.exec(input)) {
	    input = input.substr(m.index+m[0].length);
	    out.push({ type : "Header", match: m });
	}
	else if (m = comments.exec(input)) {
	    input = input.substr(m.index+m[0].length);
	    out.push({ type : "Cometarios", match: m });
	}
	else if (m = nameEqualValue.exec(input)) {
	    input = input.substr(m.index+m[0].length);
	    console.log("Longitud " +m[0].length);
	    out.push({ type : "Igualdad", match: m });
	}
	else if (m = any.exec(input)) {
	    out.push({ type : "Any", match: m });
	    input = '';
	}
	else {
	    alert("Fatal Error!"+input.substr(input,0,20));
	    input = '';
	}
	
	console.log("_"+input+"_");
    }
    return out;
}
