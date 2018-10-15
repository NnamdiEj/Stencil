const stencilTimer = (function() {

    var timers=[];
    timers.push({delay:50,nextFireTime:0,doFunction:doTimers,counter:0});
    timers.push({delay:500,nextFireTime:0,doFunction:doTimers,counter:0});
    timers.push({delay:5000,nextFireTime:0,doFunction:doTimers,counter:0});

    requestAnimationFrame(timerLoop);

    function timerLoop(currentTime){
        requestAnimationFrame(timerLoop);

        for(var i=0;i<timers.length;i++){
            if(currentTime>timers[i].nextFireTime){
                var t=timers[i];
                t.nextFireTime=currentTime+t.delay;
                t.doFunction(t,i);
            }
        }

    }

    function doTimers() {

    }

});

module.exports = stencilTimer;