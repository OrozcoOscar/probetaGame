let canvas = new Canvas()
canvas.size(document.body.clientWidth * 70 / 100, document.body.clientHeight * 70 / 100)
const k = canvas.width * .25
const NUM_MAX_PELOTA = 3//max 5
const colores = [{ color: "brown", cont: 0 }, { color: "pink", cont: 0 }, { color: "green", cont: 0 }, { color: "purple", cont: 0 }].splice(0, NUM_MAX_PELOTA);
const maxProbetas = 5

  
class Probeta {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.w = 50
        this.h = 200
        this.color = "black"
        this.contenido = []
    }
    paint() {
        canvas.rect(this.x - 20, this.y - 20, this.w + 40, this.h + 40, "white", true)
        //cuerpo de la probeta
        canvas.polygon(this.w / 2 + this.x, this.y + this.h - 10, 3, this.w, 269.9, this.color, false)
        canvas.rect(this.x, this.y, this.w, this.h, this.color, false, 1)
        //parte q limpia defectos
        canvas.polygon(this.w / 2 + this.x, this.y + this.h - 10, 3, this.w - 2, 269.9, "white", true)
        canvas.rect(this.x + 2, this.y - 10, this.w - 3, this.h, "white", true, 1)
        this.contenido.forEach(e => e.paint())
        for (let i = 0; i < 8; i++) {
            canvas.rect(this.x, this.y+50+(i*15), this.w - ((i%2==0)?30:20),2, this.color, true, 1)
        }


    }
    init() {
        if (this.id != maxProbetas - 1) {
            let suelo = this.y + this.h - 10
            let contTotal = 0
            for (let i = 0; i < NUM_MAX_PELOTA; i++) {
                let newVect = colores.filter(e => e.cont < NUM_MAX_PELOTA)
                let c = newVect[Random(0, newVect.length)];
                if (c) {

                    if (c.cont < NUM_MAX_PELOTA) {
                        c.cont++;
                        this.contenido.push(new Pelota(this.x + this.w / 2, suelo, suelo, c.color))
                        suelo = suelo - 42
                        contTotal
                    } else {

                    }
                } else {
                    break
                }

            }

        }
    }
    ckeck() {
        let c = {};

        // Recorre el array de pelotas y cuenta la cantidad de pelotas de cada color
        for (let i = 0; i < this.contenido.length; i++) {
            const color = this.contenido[i].c;
            c[color] = (c[color] || 0) + 1;
        }
        let n = Object.values(c).some(cantidad => cantidad ==NUM_MAX_PELOTA);
        return n
    }
}
class Pelota {
    constructor(x, y, suelo, c) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.suelo = suelo;
    }
    paint() {
        let radius=20
        const centerX = this.x+2;
        const centerY = this.y-1;
        const gradient = canvas.createRadialGradient(centerX, centerY, radius / 2, radius, [
            { offset: 0, color: this.c },
            { offset: 1, color: "#000" }
          ]);
    
        // Dibujar el círculo con el
        canvas.circle(this.x, this.y, radius, gradient, true);
        
    }
}




const rojo = [255, 0, 0]; // Valor RGB para el rojo
const verde = [0, 255, 0]; // Valor RGB para el verde
const TimeLoader = 30//numero de segundos
const numPasos = TimeLoader * 10; // Puedes ajustar este valor según tus necesidades

const intervalo = [
    (verde[0] - rojo[0]) / numPasos,
    (verde[1] - rojo[1]) / numPasos,
    (verde[2] - rojo[2]) / numPasos,
];
const coloresIntermedios = [];

for (let i = 0; i < numPasos; i++) {
    const colorIntermedio = [
        Math.round(rojo[0] + i * intervalo[0]),
        Math.round(rojo[1] + i * intervalo[1]),
        Math.round(rojo[2] + i * intervalo[2]),
    ];
    coloresIntermedios.push(colorIntermedio);
}

const coloresHex = coloresIntermedios.map(
    ([r, g, b]) => "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")
);
function Loader(refTime) {
    canvas.rect(canvas.width * .10, 19, canvas.width * .75, 12, "white", true)
    canvas.rect(canvas.width * .15, 20, (canvas.width * .70) * (refTime / numPasos), 10, coloresHex[refTime], true, refTime > 5 ? 5 : 1)
}

let time = numPasos
let probetas = Array(maxProbetas).fill().map((e, i) => {
    return new Probeta(i, k + (i * 120), 150)
})
probetas.forEach(e => e.init())

const ciclo = setInterval(() => {
    if (time <= 0) {
        clearInterval(ciclo)
        alert("GAME OVER")
        location.reload()
    } else {
        Loader(time)
        time--
        let GAMEOVER=0
        probetas.forEach(e =>{
            e.paint();
            e.ckeck()?GAMEOVER++:0;
        })
        if(GAMEOVER==NUM_MAX_PELOTA){
            clearInterval(ciclo)
            alert("WINNER")
        }
    }
}, 1e2)

let SELECT = null
canvas.event("click", (e) => {
    let { x, y } = canvas.getMousePosition(e)
    if (time > 0) {
        probetas.forEach(e => {
            if (x < e.x + e.w &&
                x >= e.x &&
                y < e.y + e.h &&
                y >= e.y) {

                if (SELECT && e.contenido.length < NUM_MAX_PELOTA && SELECT.contenido.length > 0 && SELECT.id != e.id) {
                    e.color = "black"
                    SELECT.color = "black"
                    let suelo = e.contenido.length == 0 ? e.y + e.h - 10 : e.contenido[e.contenido.length - 1].suelo - 42
                    let pelota = SELECT.contenido.pop()
                    pelota.x = e.x + e.w / 2
                    pelota.y = suelo
                    pelota.suelo = suelo
                    e.contenido.push(pelota)
                    SELECT = null
                } else if (SELECT && e.contenido.length == NUM_MAX_PELOTA) {
                    e.color = "black"
                    SELECT.color = "black"
                    SELECT = null
                } else if (SELECT && SELECT.id == e.id) {
                    SELECT.color = "black"
                    SELECT = null
                } else {
                    e.color = "#1cb3c8"
                    SELECT = e
                }
            }
        })
    }

})
