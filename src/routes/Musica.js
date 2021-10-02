const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Musica = require('../model/Musica')
const validaMusica = [
    check("nome", "O nome da música é obrigatório!").not().isEmpty(),
    check("banda", "O nome da artista é obrigatório!").not().isEmpty(),
    check("album", "O nome do album é obrigatório!").not().isEmpty(),
    check("lancamento", "A data de lançamento é obrigatória!").not().isEmpty(),
    check("genero", "O gênero da música é obrigatório!").not().isEmpty()
]

/****
 * Listar todas as músicas.
 ****/
router.get('/', async(req, res) => {
    try{
        const musicas = await Musica.find()
        res.json(musicas)
    } catch (err){
      res.status(500).send({
          errors: [{message: 'Não foi possível obter as músicas.'}]
      })
    }
})

/****
 * Listar uma única música pelo ID.
 ****/
router.get('/:id', async(req, res) => {
    try{
        const musica = await Musica.find({"_id" : req.params.id})
        res.json(musica)
    }catch(err){
        res.status(400).send({
            errors: [{message: `Não foi possível obter a música com o id ${req.params.id}.`}]
            })
        }
})

/****
 * Incluir uma nova música.
 ****/
 router.post("/", validaMusica, async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
        errors: errors.array()
    })
}
    try{
        let musica = new Musica(req.body)
        await musica.save()
        res.send(musica)
    }catch (err){
        return res.status(400).json({
            errors: [{message: `Erro ao salvar a música: ${err.message}.`}]
        })
    }
})

/****
 * Deletar uma música pelo id.
 ****/
router.delete('/:id', async(req, res) => {
    await Musica.findByIdAndRemove(req.params.id)
    .then(musica => {
        res.send({message: `A música ${musica.nome} foi removida com sucesso!`})
    }).catch(err => {
        return res.status(400).send({
            errors: [{message: `Não foi possível excluir a música ${musica.nome}.`}]
        })
    })
})

/****
 * Alterar uma música já existente.
 ****/
router.put('/', validaMusica, async(req, res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                    errors: errors.array()
            })
        }
        let dados = req.body
        await Musica.findByIdAndUpdate(req.body._id, {$set: dados})
        .then(musica => {
            res.send({ message: `Música ${musica.nome} alterada com sucesso!`})
        }).catch(err => {
            return res.status(400).send({
                errors: [{message: `Não foi possível alterar a música ${musica.nome}.`}]
            })
        })
})

module.exports = router