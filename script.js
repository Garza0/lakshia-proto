const { assign } = Object

const decks = [goalSetDeck, goalGetDeck, circDeck, quoteDeck]
const text = [['a', 'b', 'c'], [], [], []]

const deckShadow =
  (pos, cards) => [...Array(cards).keys()].map(i => {
    if (pos==4) return '0 ' + .1*i + 'vh 0 ' + -(i/30).toFixed(2) + 'vh'
    if (pos==9) return -.1*i + 'vw 0 0 ' + -(i/30).toFixed(2) + 'vw'
    if (pos<4) return [2, .65, -.65, -2][pos]*.1*i + 'vh ' +
      -.1*i + 'vh 0 ' + -(i/30).toFixed(2) + 'vh'
    else return  .1*i + 'vw ' + [1.4, .65, -.65, -1.4][pos-5]*.1*i +
      'vw 0 ' + -(i/30).toFixed(2) + 'vw'
  }).join(', ')

openCard.upd = cards => {
  openCard.style.setProperty('--hor', deckShadow(4, cards))
  openCard.style.setProperty('--vert', deckShadow(9, cards))
}


function flipCard(deck) {
  const vert = innerWidth<innerHeight
  glass.classList.add('active')
  glass.append(movingCard)
  front.innerText = decks[deck].children[0].innerText
  back.innerText = text[deck].pop()
  movingCard.classList.remove('animate')
  cardWrap.classList.remove('flipped', 'animate')
  const { x, y } = decks[deck].children[0].getBoundingClientRect()
  assign(movingCard.style, {left: x+'px', top: y+'px'})
  setTimeout(() => {
    front.classList.add('upCard')
    back.classList.add('biggerCard')
    movingCard.classList.add('animate')
    cardWrap.classList.add('flipped', 'animate')
    setTimeout(()=> (back.classList.remove('biggerCard'),
                    front.classList.remove('upCard')), 750)
    const { x, y, width, height } = openCard.getBoundingClientRect()
    assign(movingCard.style, {left: x-(vert? width/2.02 : width/80)+'px',
                              top: y-(vert? height/80 : height/2.02)+'px'})
    cardWrap.ontransitionend =()=> {
      cardWrap.ontransitionend = null
      openCard.innerText = back.innerText
      off.append(movingCard)
      openCard.classList.remove('hidden')
      glass.classList.remove('active')
      count[4] = Math.min(count[4]+1, 24)
      openCard.upd(count[4])
    }
  }, 0)
}

// simulation
let count = [36, 36, 36, 36, 0]
openCard.onclick =()=> {
  if (!Math.max(...count.slice(0,4))) return
  do {
    var deck = Math.random()*4|0
  } while (!count[deck])
  decks[deck].upd(count[deck]? --count[deck] : 0)
  if (!count[deck]) setTimeout(()=> decks[deck].classList.add('hidden'), 0)
  flipCard(deck)
}
decks.forEach(deck => deck.onclick = i => {
  i = decks.indexOf(deck)
  decks[i].upd(count[i]? --count[i] : 0)
  if (!count[i]) setTimeout(()=> deck.classList.add('hidden'), 0)
  flipCard(i)
})