const KeyStrokeSounds =[
    new Audio('/sounds/keystoke1.mp3'),
    new Audio('/sounds/keystoke2.mp3'),
    new Audio('/sounds/keystoke3.mp3'),
    new Audio('/sounds/keystoke4.mp3'),
];

function useKeyboardSound(){
    const playRandomSound =()=>{
        const randomSound = KeyStrokeSounds[Math.floor(Math.random()*KeyStrokeSounds.length)];

        randomSound.currentTime = 0;
        randomSound.play().catch((error)=> console.log("Audio PLay Failed : ",error));
    }
    return {playRandomSound};
}
export default useKeyboardSound