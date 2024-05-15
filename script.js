console.log('hii');

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String (remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder=folder;
    let a= await fetch(`/${folder}/`);
    let responce = await a.text();
    let div=document.createElement("div");
    div.innerHTML=responce;
    let as=div.getElementsByTagName("a");
    songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split(`${folder}/`)[1])
        }
    }

    //Show all the songs in the playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=" ";
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li> 
        <img class="invert" src="music.svg" alt="">
                        <div class="songinfo">
                            <div>${song.replaceAll("%20"," ")}</div>
                            <div> </div>
                        </div>
                        <div class="playnow">
                            <img class="invert" src="play.svg" alt="">
                        </div></li>`
    }

    //Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".songinfo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playMusic=(track,pause=false)=>{
    currentSong.src=`/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songsinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

}

async function main(){

    //get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0],true)

    //Attach an event listner to play,pause and next
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
        }
        else{
            currentSong.pause()
            play.src="play.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    })

    //Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=(currentSong.duration*percent)/100;
    })


    //Add eventlistner to hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0";
    })

    //Add eventlistner to close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-120%";
    })

    //Add eventlistner to previous button
    previous.addEventListener("click", ()=>{
        // console.log("p clicked");
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(currentSong.src.split("/"));
        if((index-1)>=0){
            playMusic(songs[index-1]);
        }
    })

    //Add eventlistner to next button
    next.addEventListener("click", ()=>{
        // console.log("n clicked");
        currentSong.pause()
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(currentSong.src.split("/"));
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })

    //Add event listner to volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        // console.log(e,e.target,e.target.value);
        currentSong.volume=parseInt(e.target.value)/100;
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
        }
    })

    //Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

    //Add event listner to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        // console.log(e.target);
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume=.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })    
} 
main()