//Write a string to the event list
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

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
    el.innerHTML = name;
    playerNames.appendChild(el);
  })
})

const addButtonListeners = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      sock.emit('move', id);
      sock.emit('rename', id);
    })
  })
};

const scrollMessagesToBottom = () => {
  var messageList = document.querySelector('#events');
  messageList.scrollTop = messageList.scrollHeight;
}

writeEvent('Welcome to RPS');

document.querySelector('#chat-form').addEventListener('submit', onChatSubmitted);
document.querySelector('#rename-form').addEventListener('submit', onRenameSubmitted);

addButtonListeners();

const ctx = document.querySelector('#ctx').getContext("2d");;

sock.on('newPositions',function(data){
  console.log(data);
    ctx.clearRect(0,0,500,500);
     ctx.fillText('P', data.x,data.y);
});
