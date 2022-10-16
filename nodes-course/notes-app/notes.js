const fs = require('fs')
const chalk = require('chalk')

//####################################

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}


const loadNotes = () => {
    try {
        const dataJSON = fs.readFileSync('notes.json').toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}


const addNote = (title, body) => {

    const notes = loadNotes();
    const duplicatesNote = notes.find((note) => note.title === title)

    if (!duplicatesNote){
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes);
        console.log(chalk.green.inverse('Note added!'))
    } else {
        console.log(chalk.red.inverse('This title already exist!'))
    }
}


const deleteNote = function (title) {

    const notes = loadNotes();
    const notesFiltering = notes.filter((note) => {
        if (title !== note.title){
            return true
        } else {
            console.log(chalk.green.inverse('Note deleted: ' + note.title))
            return false
        }
    })

    if (notes.length === notesFiltering.length){
        console.log(chalk.red.inverse('Questa nota non è presente...'))
    } else {
        saveNotes(notesFiltering);
    }
}

const listNotes = () => {

    const notes = loadNotes();

    console.log(chalk.blue.inverse('Your notes:'))
    notes.forEach((note) => {
        console.log('note title - ' + note.title) 
    })
}

const readNote = (title) => {

    const notes = loadNotes();

    const noteToRead = notes.find((note) => note.title === title)

    if (noteToRead) {
        console.log(chalk.green.bold(noteToRead.title) + ' - ' + noteToRead.body)
    } else {
        console.log(chalk.red.inverse('Note not found!'))
    }
}


module.exports = {
    addNote: addNote,
    deleteNote: deleteNote,
    listNotes: listNotes,
    readNote: readNote
}
