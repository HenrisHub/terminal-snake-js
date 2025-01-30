#!/usr/bin/env -S node --no-warnings --experimental-strip-types
import * as readline from "node:readline";

type coord = {x:number,y:number}

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true);
process.stdin.on("keypress",(s,k) => {
    if(k.sequence==="\u0003")exit()
    if(s==="w")dir="u"
    if(s==="a")dir="l"
    if(s==="s")dir="d"
    if(s==="d")dir="r"
})

const height = process.stdout.rows
const width = process.stdout.columns
const snake:coord[] = [{x:Math.round(width/2),y:Math.round(height/2)}]
const dirs:Record<"u"|"d"|"l"|"r",coord> = {u:{x:0,y:-1},d:{x:0,y:1},l:{x:-1,y:0},r:{x:1,y:0}}
let dir: keyof typeof dirs = "u"
let fruit:coord = randomCoord()
let score = 0

function color(s:string,c:"r"|"g"|"y",w?:"b"){return`${w==="b"?"\x1b[1m":""}${{r:"\x1b[31m",g:"\x1b[32m",y:"\x1b[33m"}[c]}${s}\x1b[0m`}
function renderScore(p:coord){`score: ${score}\n`.split("").forEach((v,i,a)=>renderAt({x:Math.floor(p.x-(a.length-1)/2)+i,y:p.y},v))}
function randomCoord():coord{const p = {x:Math.ceil(Math.random()*(width-1)+1),y:Math.ceil(Math.random()*(height-1)+1)};return collision(p)?randomCoord():p}
function exit(){clear();toggleCursor(true);"GAME OVER !\n".split("").forEach((v,i)=>renderAt({x:Math.floor(width/2+i-5),y:Math.floor(height/2)},color(v,"r","b")));renderScore({y:Math.floor(height/2)+2,x:width/2});renderAt({y:height,x:0},"\n");process.exit(0)}
function bounds(p:coord){return p.x>width||p.x<0||p.y>height||p.y<=1}
function collision(p:coord){return snake.some(sp=>sp.x===p.x&&sp.y===p.y)}
function writeOut(s:string){process.stdout.write(s)}
function renderAt(p:coord,v:string){writeOut(`\x1b[${p.y};${p.x}H${v}`)}
function clear(){writeOut("\x1b[2J")}
function toggleCursor(v:boolean){writeOut(`\x1b[?25${v?"h":"l"}`)}
function game(){
    const n = {x:snake[0].x+dirs[dir].x,y:snake[0].y+dirs[dir].y};
    renderScore({y:1,x:width/2})
    if(collision(n)||bounds(n)) exit()
    fruit.x===n.x&&fruit.y===n.y?(renderAt(fruit," "),fruit=randomCoord(),++score):(renderAt(snake[snake.length-1]," "),snake.pop())
    snake.unshift(n)
    renderAt(fruit,color("x","r","b"))
    snake.forEach((s,i)=>renderAt(s,color(i===0?"0":"O",i%2===0?"g":"y",i%2===0?"b":undefined)))
}

toggleCursor(false)
clear()
setInterval(game,60)
