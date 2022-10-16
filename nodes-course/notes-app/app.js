
const { argv } = require('yargs')
const yargs = require('yargs')
const notes = require('./notes')


//-------------

// Add command
yargs.command({
    command:'add',
    description:'Add a note',
    builder: {
        title: {
            description: "Notes title",
            demandOption: true,
            type: 'string'
        },
        body:{
            description: 'Body of the note',
            type: 'string'
        }
    },
    handler (argv) {
        notes.addNote(argv.title,argv.body)
    }
})


// Delete command
yargs.command({
    command:'delete',
    description:'Delete a note',
    builder: {
        title: {
            description: "Notes title",
            demandOption: true,
            type: 'string'
        }
    },
    handler (argv) {
        notes.deleteNote(argv.title)
    }
})

// Listing command
yargs.command({
    command:'list',
    description:'List of notes',
    handler () {
        notes.listNotes();
    }
})

// Read command
yargs.command({
    command:'read',
    description:'Read a notes body',
    builder: {
        title: {
            description: 'Titles of note to read',
            demandOption: true
        }
    },
    handler (argv) {
        notes.readNote(argv.title)
    }
})

yargs.parse()