var topv,topvm1,topvm2
var ojoy_oy,m1_oy,m2_oy
var fjoy_ox,fjoy_oy

var ojoy=document.getElementById("ojoy")
var fjoy=document.getElementById("fjoy")

var m1=document.getElementById("m1")
var m2=document.getElementById("m2")

ojoy.style.top = `${200}px`
m1.style.top = `${100}px`
m2.style.top = `${100}px`


let ojoy_pointerId = null;
let fjoy_pointerId = null;

let m1_pointerId = null;
let m2_pointerId = null;

async function remotetest(o,jx,jy,m1,m2){
    
    const res=await fetch("https://espdrone-render.onrender.com/value",{

        method:"POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            o:o,
            jx:jx,
            jy:jy,
            t:m1,
            b:m2
        })

    })

}


document.addEventListener("pointermove", (ev) => {
    if (ev.pointerId === ojoy_pointerId) {
        if (ev.clientY - ojoy_oy + topv > 200) {
            ojoy.style.top = `${200}px`
        }
        else if (ev.clientY - ojoy_oy + topv < 0) {
            ojoy.style.top = `${0}px`
        }
        else {
            ojoy.style.top = `${ev.clientY - ojoy_oy + topv}px`
        }

        console.log(ojoy.style.top.slice(0,-2))

        remotetest(ojoy.style.top.slice(0,-2),fjoy.style.left.slice(0,-2),fjoy.style.top.slice(0,-2),m1.style.top.slice(0,-2),m2.style.top.slice(0,-2))
    }

    else if (ev.pointerId === m1_pointerId) {
        if (ev.clientY - m1_oy + topvm1 > 100) {
            m1.style.top = `${100}px`
        }
        else if (ev.clientY - m1_oy + topvm1 < 0) {
            m1.style.top = `${0}px`
        }
        else {
            m1.style.top = `${ev.clientY - m1_oy + topvm1}px`
        }

        console.log(m1.style.top.slice(0,-2))

        remotetest(ojoy.style.top.slice(0,-2),fjoy.style.left.slice(0,-2),fjoy.style.top.slice(0,-2),m1.style.top.slice(0,-2),m2.style.top.slice(0,-2))

    }

    else if (ev.pointerId === m2_pointerId) {
        if (ev.clientY - m2_oy + topvm2 > 100) {
            m2.style.top = `${100}px`
        }
        else if (ev.clientY - m2_oy + topvm2 < 0) {
            m2.style.top = `${0}px`
        }
        else {
            m2.style.top = `${ev.clientY - m2_oy + topvm2}px`
        }

        console.log(m2.style.top.slice(0,-2))

        remotetest(ojoy.style.top.slice(0,-2),fjoy.style.left.slice(0,-2),fjoy.style.top.slice(0,-2),m1.style.top.slice(0,-2),m2.style.top.slice(0,-2))

    }

    else if (ev.pointerId === fjoy_pointerId) {

        if (ev.clientX - fjoy_ox > 70) {
            fjoy.style.left = `${70}px`
        }
        else if (ev.clientX - fjoy_ox < -70) {
            fjoy.style.left = `${-70}px`
        }
        else {
            fjoy.style.left = `${ev.clientX - fjoy_ox}px`
        }

        if (ev.clientY - fjoy_oy > 70) {
            fjoy.style.top = `${70}px`
        }
        else if (ev.clientY - fjoy_oy < -70) {
            fjoy.style.top = `${-70}px`
        }
        else {
            fjoy.style.top = `${ev.clientY - fjoy_oy}px`
        }

        // remotetest(ojoy.style.top.slice(0,-2),fjoy.style.left.slice(0,-2),fjoy.style.top.slice(0,-2))
    }
})

ojoy.addEventListener("pointerdown", (ev) => {
    ojoy_pointerId = ev.pointerId;
    ojoy_oy = ev.clientY;
    topv = parseInt(window.getComputedStyle(ojoy).top, 10);
    ojoy.setPointerCapture(ev.pointerId);
})

fjoy.addEventListener("pointerdown", (ev) => {
    fjoy_pointerId = ev.pointerId;
    fjoy_ox = ev.clientX;
    fjoy_oy = ev.clientY;
    fjoy.style.transition = "0s";
    fjoy.setPointerCapture(ev.pointerId);
})

m1.addEventListener("pointerdown", (ev) => {
    m1_pointerId = ev.pointerId;
    m1_oy = ev.clientY;
    topvm1 = parseInt(window.getComputedStyle(m1).top, 10);
    m1.setPointerCapture(ev.pointerId);
})

m2.addEventListener("pointerdown", (ev) => {
    m2_pointerId = ev.pointerId;
    m2_oy = ev.clientY;
    topvm2 = parseInt(window.getComputedStyle(m2).top, 10);
    m2.setPointerCapture(ev.pointerId);
})

document.addEventListener("pointerup", (ev) => {
    if (ev.pointerId === ojoy_pointerId) {
        ojoy_pointerId = null;
    }

    if (ev.pointerId === fjoy_pointerId) {
        fjoy_pointerId = null;
        fjoy.style.transition = ".1s";
        fjoy.style.left = "0px";
        fjoy.style.top = "0px";
    }

    if (ev.pointerId === m1_pointerId){
        m1_pointerId=null;
    }

    if (ev.pointerId === m2_pointerId){
        m2_pointerId=null;
    }
})
