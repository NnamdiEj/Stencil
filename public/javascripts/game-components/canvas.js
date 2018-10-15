const stencil = (function() {

    const script_tag = document.getElementById('canvas-script');
    const query = script_tag.src.replace(/^[^\?]+\??/,'');
    // Parse the querystring into arguments and parameters
    const vars = query.split("&");
    let args = {};
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        // decodeURI doesn't expand "+" to a space.
        args[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ');
    }
    const roomName = args['roomName'];

    // Make connection
    //let socket = io('localhost:3000');
    socket.emit('joinRoom', {
        roomName: roomName,
    });

// Query DOM
    const canvasDiv = document.getElementsByClassName('canvas-wrapper')[0];
    const purpleButton = document.getElementById('purple');
    const greenButton = document.getElementById('green');
    const yellowButton = document.getElementById('yellow');
    const brownButton = document.getElementById('brown');
    const smallButton = document.getElementById('small');
    const mediumButton = document.getElementById('medium');
    const largeButton = document.getElementById('large');

// Variables
    const canvasWidth = 900;
    const canvasHeight = 504;
    const colorPurple = "#cb3594";
    const colorGreen = "#659b41";
    const colorYellow = "#ffcf33";
    const colorBrown = "#986928";

    let curColor = colorPurple;
    let curSize = "small";
    let clickColor = new Array();
    let paint = false;
    let clickX = new Array();
    let clickY = new Array();
    let clickDrag = new Array();
    let clickSize = new Array();

// Setup canvas
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('class', 'canvas');
    canvasDiv.insertBefore(canvas, canvasDiv.firstChild);
    console.log('I made it');

    if (typeof G_vmlCanvasManager !== "undefined") {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");

// Function called when user initially clicks/presses on canvas
    const press = function (e) {
        const mouseX = e.pageX - this.offsetLeft;
        const mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    };

// Function called when user drags across canvas
    const drag = function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    };

// Function called when user releases click/press
    const release = function () {
        paint = false;
    };

// Function called when user drags off of canvas
    const cancel = function () {
        paint = false;
    };

    const addClick = function (mouseX, mouseY, dragging) {
        clickX.push(mouseX);
        clickY.push(mouseY);
        clickDrag.push(dragging);
        clickColor.push(curColor);
        clickSize.push(curSize);
    };

    const redraw = function () {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.lineJoin = "round";

        for (let i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            if (clickSize[i] === "small")
                context.lineWidth = 5;
            else if (clickSize[i] === "medium")
                context.lineWidth = 10;
            else if (clickSize[i] === 'large')
                context.lineWidth = 15;
            context.strokeStyle = clickColor[i];
            context.stroke();
        }
    };

    const promptRedraw = function () {
        socket.emit('draw', {
            newClickX: clickX,
            newClickY: clickY,
            newClickDraw: clickDrag,
            newClickColor: clickColor,
            newClickSize: clickSize,
            roomName: roomName
        });
    };

    const colorButtonActive = function (event) {
        purpleButton.setAttribute('class', 'passive');
        greenButton.setAttribute('class', 'passive');
        yellowButton.setAttribute('class', 'passive');
        brownButton.setAttribute('class', 'passive');
        event.target.setAttribute('class', 'active');
    };

    const sizeButtonActive = function (event) {
        smallButton.setAttribute('class', 'size-passive');
        mediumButton.setAttribute('class', 'size-passive');
        largeButton.setAttribute('class', 'size-passive');
        event.target.setAttribute('class', 'size-active');
    };

// Add mouse event listeners to canvas element
    canvas.addEventListener("mousedown", press, false);
    canvas.addEventListener("mousemove", drag, false);
    canvas.addEventListener("mouseup", release);
    canvas.addEventListener("mouseout", cancel, false);

// Add socket event listeners to canvas element
    canvas.addEventListener("mousedown", promptRedraw);
    canvas.addEventListener("mousemove", promptRedraw);
    canvas.addEventListener("mouseup", promptRedraw);
    canvas.addEventListener("mouseout", promptRedraw);

    socket.on('draw', function (data) {
        clickX = data.newClickX;
        clickY = data.newClickY;
        clickDrag = data.newClickDraw;
        clickColor = data.newClickColor;
        clickSize = data.newClickSize;
        redraw();
    });

    purpleButton.addEventListener('click', function (event) {
        curColor = colorPurple;
        colorButtonActive(event);
    });

    greenButton.addEventListener('click', function (event) {
        curColor = colorGreen;
        colorButtonActive(event);
    });

    yellowButton.addEventListener('click', function (event) {
        curColor = colorYellow;
        colorButtonActive(event);
    });

    brownButton.addEventListener('click', function (event) {
        curColor = colorBrown;
        colorButtonActive(event);
    });

    smallButton.addEventListener('click', function (event) {
        curSize = 'small';
        sizeButtonActive(event);
    });

    mediumButton.addEventListener('click', function (event) {
        curSize = 'medium';
        sizeButtonActive(event);
    });

    largeButton.addEventListener('click', function (event) {
        curSize = 'large';
        sizeButtonActive(event);
    });

});

stencil();

