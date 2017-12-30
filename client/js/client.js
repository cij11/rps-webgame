//Write a string to the event list
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
}

const onFormSubmitted = (e) => {
  e.preventDefault(); //Don't want to reload page

  const input = document.querySelector('#chat');
  const text = input.value; //Get input
  input.value = '';         //Clear input field

  //Send text
  sock.emit('message', text);
};

//Save reference to socket.
const sock = io();

//Register event for recieving message of type 'message' and text string 'text'
sock.on('message', (text) => {
  writeEvent(text);
});

const addButtonListeners = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      sock.emit('move', id);
    })
  })
};

writeEvent('Welcome to RPS');

document.querySelector('#chat-form').addEventListener('submit', onFormSubmitted);

addButtonListeners();
