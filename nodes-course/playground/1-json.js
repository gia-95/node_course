const fs = require('fs')

//Prendo lo stream dal file --> con toString() lo casto da byte a stringa
const dataJSON = fs.readFileSync('1-json.json').toString();

//Da stringa lo casto a oggetto JSON con JSON.parse()
const person = JSON.parse(dataJSON)

//Cambio i valori
person.name = 'Gianluca'
person.age = '27'

//Risalvo sul file --> deve essere salvato come stringa, quindi lo converto
fs.writeFileSync('1-json.json', JSON.stringify(person))