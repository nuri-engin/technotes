const express = require('express');

const Joi = require('joi');

const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const commentService = require('./comment.service');

const validateRequest = require('_middleware/validate-request');

const router = express.Router();

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(Role.Admin), getComment);
router.get('/post/:postmessage_id', authorize(Role.Admin), getPostmessageComments);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

/**
 * Express.js Posts Controller
 */
module.exports = router;

function getAll(req, res, next) {
    commentService.getAll()
        .then(comments => {
            res.json(comments);
        })
        .catch(next);
}

function getPostmessageComments(req, res, next) {
    if (!req.params.postmessage_id) return res.status(401).json({ message: 'No comment found' });

    commentService.getPostmessageComments(req.params.postmessage_id)
        .then(comments => {
            res.json(comments);
        })
        .catch(next);
}

function getComment(req, res, next) {
    if (!req.params.id) return res.status(401).json({ message: 'No comment found' });

    commentService.getComment(req.params.id)
        .then(comment => {
            res.json(comment);
        })
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object(_getSchemaRules());

    console.log("Comment schema is: ", schema);

    validateRequest(req, next, schema);
}

function create(req, res, next) {
    commentService.create(req.body)
        .then(post => res.json(post))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object(_getSchemaRules());

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own comments and admins can update any post
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    commentService.update(req.params.id, req.body)
        .then(comment => res.json(comment))
        .catch(next);
}

function _delete(req, res, next) {
    // users can update their own comments and admins can update any post
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    commentService.delete(req.params.id)
        .then(() => res.json({ message: 'Comment deleted successfully' }))
        .catch(next);
}

function _getSchemaRules() {
    const schemaRules = {
        postmessage_id: Joi.string().empty(''),
        creator: Joi.string().empty(''),
        message: Joi.string().empty(''),
        updated: Joi.date().empty(''),
        created: Joi.date().empty('')
    };

    return schemaRules;
}
