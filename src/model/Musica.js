const mongoose = require('mongoose')

const MusicaSchema = mongoose.Schema({
    nome: {type: String},
    banda: {type: String},
    album: {type: String},
    genero: {type: String},
    lancamento: {type: String} 
},{timestamps:true})

module.exports = mongoose.model('musica', MusicaSchema)