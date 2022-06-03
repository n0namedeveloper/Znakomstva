
  const dedline = "2022-06-31"

  function getTimeRemaining(endTime){
    const t = Date.parse(endTime) - Date.parse(new Date()) 
    const days = Math.floor(t/(1000*60*60*24))
    const hours = Math.floor((t/(1000*60*60))%24)
    const minutes = Math.floor((t/(1000*60))%60)
    const seconds = Math.floor((t/1000)%60)
  
    return{
      total: t,
      days:days,
      hours:hours,
      minutes:minutes,
      seconds:seconds
    }
  }

  function setClock(selector,endTime){
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');
    const setinterval = setInterval(updateClock, 1000)
    updateClock()

function addZero (num) {
  if(num > 0 && num < 10){
    return `0${num}`
  }
  else{
    return num
  }

}


  function updateClock(){
    const t = getTimeRemaining(endTime)

    days.innerHTML = addZero(t.days)
    hours.innerHTML = addZero(t.hours)
    minutes.innerHTML = addZero(t.minutes)
    seconds.innerHTML = addZero(t.seconds)

    if (t.total <= 0){
      clearInterval(setinterval);
    }
  }
}
setClock('.timer', dedline)





const openModal = document.getElementById('open_modal') 
const closeModal = document.getElementById('close_modal') 
const modal = document.getElementById('modal') 
 
openModal.addEventListener('click', function(e){ 
    e.preventDefault() 
    modal.classList.add('active') 
}) 
 
closeModal.addEventListener('click', () =>{ 
    modal.classList.remove('active') 
})



function addvelueInput(){
  const text = document.querySelector('.text').value
  const email = document.querySelector('.email').value
  
  return {
      text:text,
      email:email
  }  
}

const btn = document.querySelector('.button_form')

function addvelueInput(){
  const click = document.querySelector('.click').value
  const cntn = document.querySelector('.continue').value
  
  return {
      click: click,
      cntn: cntn,
  }  
}

btn.addEventListener('click',(event)=>{
const value = addvelueInput()
let str =   JSON.stringify(value)

localStorage.setItem('test',str)
})







const openModal1 = document.getElementById('open_modal1') 
console.log(openModal1);
const closeModal1 = document.getElementById('close_modal1') 
const modal1 = document.getElementById('modal1')
console.log(modal1); 
 
openModal1.addEventListener('click', function(e){
  e.preventDefault() 
 modal1.classList.add('active1') 
}) 
 
closeModal1.addEventListener('click', () =>{ 
    modal1.classList.remove('active1') 
})