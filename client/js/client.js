//Write a string to the event list
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
}

//Save reference to socket.
const sock = io();

//Register event for recieving message of type 'message' and text string 'text'
sock.on('message', (text) => {
  writeEvent(text);
});

writeEvent('Welcome to RPS');
