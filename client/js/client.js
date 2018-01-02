//Write a string to the event list
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');
  var text_node = document.createTextNode(text);
  // <li> element
  const el = document.createElement('li');
  el.appendChild(text_node);
//  el.innerHTML = text;

  parent.appendChild(el);
}

const onChatSubmitted = (e) => {
  e.preventDefault(); //Don't want to reload page

  const input = document.querySelector('#chat');
  const text = input.value; //Get input
  input.value = '';         //Clear input field

  //Send text
  sock.emit('message', text);
};

const onRenameSubmitted = (e) => {
  e.preventDefault(); //Don't want to reload page

  const input = document.querySelector('#rename-text');
  const text = input.value; //Get input
  input.value = '';         //Clear input field

  //Send text
  sock.emit('rename', text);
};

//Save reference to socket.
const sock = io();

//Register event for recieving message of type 'message' and text string 'text'
sock.on('message', (text) => {
  writeEvent(text);
  scrollMessagesToBottom();
});

sock.on('update-names', nameList => {
  console.log(nameList);
  const playerNames = document.querySelector('#player-names');
  playerNames.innerHTML = '';
  _.forEach(nameList, name => {
    const el = document.createElement('li');
    var text_node = document.createTextNode(name);
    el.appendChild(text_node);
    playerNames.appendChild(el);
  })
})

const scrollMessagesToBottom = () => {
  var messageList = document.querySelector('#events');
  messageList.scrollTop = messageList.scrollHeight;
}

writeEvent('Welcome to Game');

document.querySelector('#chat-form').addEventListener('submit', onChatSubmitted);
document.querySelector('#rename-form').addEventListener('submit', onRenameSubmitted);

const ctx = document.querySelector('#ctx').getContext("2d");;

sock.on('newPositions',function(data){
  console.log(data);
    ctx.clearRect(0,0,500,500);
    var units = data.units;
    _.forEach(units, unit => {
      ctx.fillText('P', unit.x,unit.y);
    })

});



document.onkeydown = function(event){
    if(event.keyCode === 68)    //d
        sock.emit('keyPress',{inputId:'right',state:true});
    else if(event.keyCode === 83)   //s
        sock.emit('keyPress',{inputId:'down',state:true});
    else if(event.keyCode === 65) //a
        sock.emit('keyPress',{inputId:'left',state:true});
    else if(event.keyCode === 87) // w
        sock.emit('keyPress',{inputId:'up',state:true});

}
document.onkeyup = function(event){
    if(event.keyCode === 68)    //d
        sock.emit('keyPress',{inputId:'right',state:false});
    else if(event.keyCode === 83)   //s
        sock.emit('keyPress',{inputId:'down',state:false});
    else if(event.keyCode === 65) //a
        sock.emit('keyPress',{inputId:'left',state:false});
    else if(event.keyCode === 87) // w
        sock.emit('keyPress',{inputId:'up',state:false});
}
