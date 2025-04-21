let socket ; 
let username='';
let room='';
let typingTimeout;

const joinBtn=document.getElementById('join-btn')
const sendBtn=document.getElementById('send-btn')
const messageInput=document.getElementById('message-input')

joinBtn.addEventListener('click',()=>{
    username=document.getElementById('username').value.trim()
    room=document.getElementById('room').value.trim()

    if(!username || !room )return alert('please enter name and room.')

    document.getElementById('join-screen').classList.add('hidden')
    document.getElementById('chat-screen').classList.remove('hidden')
    document.getElementById('room-name').textContent=room

    connectWebsocket()
})
function connectWebsocket(){
    const serverIP = window.location.hostname;
    socket=new WebSocket(`ws://${serverIP}:3000`)
    socket.onopen=()=>{
        socket.send(JSON.stringify({
            type:'join',
            user:username,
            room:room
        }))
    }
    const messages=document.getElementById("messages")
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    socket.onmessage=function (event) {
        const data=JSON.parse(event.data)
        const chatBox=document.getElementById('chat-box')

        if(data.type==='message'){
            addMessage(`${data.user}:${data.message}`)
            // if(data.user===currentlyTypingUser){
            //     // hideTypingIndicator();
            // }
        }
        else if(data.type==='notificaiton'){
            addMessage(`${data.message}`,true)
        }
        else if(data.type==='typing' && data.user!==username){
            showTypingIndicator(data.user)
        }

    }
    socket.onclose=()=>{
        addMessage(`user disconnected from server`)
    }
}

function addMessage(msg,isSystem=false){
    const div=document.createElement('div')
    div.textContent=msg
    div.className=isSystem? 'text-sm text-gray-500':'bg-blue-100 p-2 rounded'
    document.getElementById('chat-box').appendChild(div)
    div.scrollIntoView({behavior:'smooth'})

}

sendBtn.addEventListener('click',sendMessage)

messageInput.addEventListener('keypress',(e)=>{    
    if(e.key=="Enter") sendMessage()
    socket.send(JSON.stringify({
        type:'typing',
        user:username,
        room:room
    }))
})

function sendMessage(){
    const msg=messageInput.value.trim()
    if(!msg) return

    socket.send(JSON.stringify({
        type:'message',
        user:username,
        room:room,
        message:msg
    }))
    messageInput.value=""
}

function showTypingIndicator(who){
    const typingDiv=document.getElementById('typing-indicator')
    typingDiv.textContent=`${who} is typing...`
    typingDiv.classList.remove('hidden')

    clearTimeout(typingTimeout);

    // Hide after 3 seconds of inactivity
    typingTimeout = setTimeout(() => {
        typingDiv.classList.add('hidden');
        typingDiv.textContent = '';
    }, 2000);
}
// function hideTypingIndicator(){
//     const typingDiv=document.getElementById('typing-indicator')
//     typingDiv.classList.add('hidden')
//     currentlyTyingUser=null
// }
