const overlay=document.getElementById('overlay');
const video=document.getElementById('introVideo');
const message=document.getElementById('messageClick');
let pauseEffectuee=false;
const allHackTexts=document.querySelectorAll('.hack-text:not(#messageClick)');
allHackTexts.forEach(el=>{el.dataset.originalText=el.innerText;el.innerText="";});
const isHomePage=document.querySelector('.bento-grid')!==null;
const pageCards=document.querySelectorAll('.link-card, .project-card');
const headers=document.querySelectorAll('h1.hack-text, h2.hack-text');
const gridBoxes=document.querySelectorAll('.grid-box');
const footer=document.querySelector('.footer-section');

if(localStorage.getItem('theme')==='light')document.body.classList.add('light-mode');

window.addEventListener('load',function(){
    updateBtnText();
    if(overlay&&isHomePage){
        if(sessionStorage.getItem('introSeen')==='true'){
            overlay.style.display='none';
            startHeaderSequence();
        }
    }else{
        startGenericPageSequence();
        if(footer)footer.classList.add('box-visible');
    }
});

if(overlay&&video){
    let slowMotionFait = false;
    overlay.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            if (pauseEffectuee) {
                video.playbackRate = 1.0; 
            }
            if (message) message.style.display = 'none';
        }
    });
    video.addEventListener('timeupdate', function() {
        if (video.currentTime >= 6 && !slowMotionFait) {
            video.playbackRate = 0.5;
            slowMotionFait = true;
        }
        if (video.currentTime >= 8.5 && !pauseEffectuee) {
            video.pause();
            pauseEffectuee = true;
            if (message) {
                message.innerText = "CLIQUER POUR CONTINUER";
                message.style.display = 'block';
            }
        }
    });
    video.addEventListener('ended',function(){
        sessionStorage.setItem('introSeen','true');
        overlay.style.display='none';
        setTimeout(()=>{startHeaderSequence();},500);
    });
}

function startHeaderSequence(){
    typeWriterSpecificList(headers,0,function(){revealBoxSequence(gridBoxes,0);});
}

function startGenericPageSequence(){
    if(pageCards.length>0){
        const introTexts=document.querySelectorAll('.contenu-site > .hack-text');
        typeWriterSpecificList(introTexts,0,function(){revealBoxSequence(pageCards,0);});
    }else{
        typeWriterSpecificList(allHackTexts,0,null);
    }
}

function revealBoxSequence(boxesList,index){
    if(index>=boxesList.length){
        if(footer)footer.classList.add('box-visible');
        return;
    }
    const currentBox=boxesList[index];
    if(currentBox){
        currentBox.classList.add('box-visible');
        const textElementsInBox=currentBox.querySelectorAll('.hack-text');
        typeWriterSpecificList(textElementsInBox,0,function(){
            setTimeout(()=>{revealBoxSequence(boxesList,index+1);},200);
        });
    }
}

function typeWriterSpecificList(elementsList,elementIndex,onFinishedCallback){
    const list=Array.from(elementsList);
    if(elementIndex>=list.length){
        if(onFinishedCallback)onFinishedCallback();
        return;
    }
    const element=list[elementIndex];
    if(element){
        const text=element.dataset.originalText||"";
        let charIndex=0;
        element.classList.add('typing-cursor');
        function typeChar(){
            if(charIndex<text.length){
                element.innerText=text.substring(0,charIndex+1);
                charIndex++;
                let randomSpeed=Math.floor(Math.random()*20)+10;
                setTimeout(typeChar,randomSpeed);
            }else{
                element.classList.remove('typing-cursor');
                setTimeout(()=>{typeWriterSpecificList(list,elementIndex+1,onFinishedCallback);},50);
            }
        }
        typeChar();
    }else{
        typeWriterSpecificList(list,elementIndex+1,onFinishedCallback);
    }
}

function replaySystem(){
    sessionStorage.removeItem('introSeen');
    window.location.reload();
}

function toggleTheme(){
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme',document.body.classList.contains('light-mode')?'light':'dark');
    updateBtnText();
}

function updateBtnText(){
    const btn=document.getElementById('theme-btn');
    if(btn)btn.innerText=document.body.classList.contains('light-mode')?"MODE: LIGHT":"MODE: DARK";
    if(typeof createParticles==="function")createParticles();

}
