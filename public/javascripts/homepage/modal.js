// Get the modal
const registrationModal = document.getElementsByClassName('modal')[0];

// Get the button that opens the modal
const createRoom = document.getElementById("create-room");

// Modal
const registrationForm = document.getElementById('room-creation-form');

// Get the <span> element that closes the modal
const cancelRegistration = document.getElementsByClassName("cancelbtn")[0];

// Get private room checkbox
const privateRoomCheckbox = document.getElementById('private');

// Get Password Div
const passwordBox = document.getElementById('roomPasswordBox');

// When the user clicks on the button, open the modal
createRoom.onclick = function() {
    registrationModal.style.display = "block";
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' || event.key === 27) {
            registrationModal.style.display = "none";
            registrationForm.reset();
        }
    });
};

// When the user clicks on <span> (x), close the modal
cancelRegistration.onclick = function() {
    registrationModal.style.display = "none";
    registrationForm.reset();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
};

privateRoomCheckbox.onclick = function() {
    if (privateRoomCheckbox.checked === true) {
        passwordBox.style.display = "block";
    } else {
        passwordBox.style.display = "none";
    }
};
