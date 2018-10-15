// Closure handling chat component of game
const stencilChat = (function () {

    // Get script tag in HTML page
    const script_tag = document.getElementById('chat-script');

    // Get src property of script tag and reformat it
    const query = script_tag.src.replace(/^[^\?]+\??/,'');

    // Parse the querystring into arguments and parameters
    const vars = query.split("&");
    let args = {};
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        // decodeURI doesn't expand "+" to a space.
        args[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ');
    }

    // Get arguments
    const roomName = args['roomName'];
    const username = args['username'];

    //
    socket.emit('joinRoom', {
        roomName: roomName,
    });

    // Query DOM
    const message = document.getElementsByClassName('message')[0];
    const btn = document.getElementsByClassName('submit-button')[0];
    const messages = document.getElementById('messages');
    const typingText = document.getElementsByClassName('typing')[0];

    if (btn) {
        btn.addEventListener('click', function() {
            console.log('click');
            socket.emit('chat', {
                message: message.value,
                roomName: roomName,
                username: username
            });
            message.value = "";
            socket.emit('typing', {
                hasText: false,
                roomName: roomName,
                username: username
            });
        });
    }

    message.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && message.value !== "") {
            socket.emit('chat', {
                message: message.value,
                roomName: roomName,
                username: username
            });
            message.value = "";
            socket.emit('typing', {
                hasText: false,
                roomName: roomName,
                username: username
            });
        } else {
            socket.emit('typing', {
                hasText: !(message.value.length <= 1 && event.key === 'Backspace'),
                roomName: roomName,
                username: username
            });
        }
    });

    socket.on('chat', function(data) {
        messages.innerHTML += '<li><strong>' + data.username + ': </strong>' + data.message + '</li>';
    });

    socket.on('typing', function(data) {
        if (data.hasText) {
            typingText.innerHTML = '<i>' + data.username + ' is typing a message..';
        } else {
            typingText.innerHTML = "";
        }
    });
});

stencilChat();