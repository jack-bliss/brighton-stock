var evelem = document.getElementById('events');

function GetJSON(url){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function(data){
            resolve(JSON.parse(data.target.response));
        });
        xhr.open('GET', url);
        xhr.send();
    });
}

function Elem(type, attr){
    var e = document.createElement(type);
    for(var x in attr){
        if(attr[x] === 'class'){
            if(Array.isArray(attr[x])){
                attr[x].forEach(function(cl){
                    e.classList.add(cl);
                })
            } else {
                e.classList.add(attr[x]);
            }
        } else {
            e.setAttribute(x, attr[x]);
        }
    }
    for(var i = 2; i < arguments.length; i++){
        if(typeof arguments[i] === "string" || typeof arguments[i] === "number"){
            e.appendChild(Text(arguments[i]));
        } else {
            e.appendChild(arguments[i]);
        }
    }
    return e;
}

function Text(t){
    return document.createTextNode(t+"");
}

var now = Date.now();
GetJSON('/events').then(function(events){
    events
        .filter(function(event){
            var d = moment(event.date, 'DD/MM/YYYY');
            return d.format('x') > now;
        }).map(function(event){
            var li = Elem('li');
            if(event.link){
                var a = Elem('a', {
                    href: event.link
                }, event.name);
                li.appendChild(a);
            } else {
                li.appendChild(Text(event.name));
            }

            li.appendChild(Text(' - '+event.date));
            return li;
        }).forEach(function(event){
            evelem.appendChild(event);
        });
});