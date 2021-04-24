const express = require('express');

const Joi = require('joi');

const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const postService = require('./post.service');

const validateRequest = require('_middleware/validate-request');

const router = express.Router();

// routes
router.get('/', authorize(Role.Admin), getAll);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

/**
 * Express.js Posts Controller
 */
module.exports = router;


function getAll(req, res, next) {
    postService.getAll()
        .then(posts => {
            res.json(posts);
        })
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object(_getSchemaRules());

    console.log("POST schema is: ", schema);

    validateRequest(req, next, schema);
}

function create(req, res, next) {
    postService.create(req.body)
        .then(post => res.json(post))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object(_getSchemaRules());

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own post and admins can update any post
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    postService.update(req.params.id, req.body)
        .then(post => res.json(post))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    postService.delete(req.params.id)
        .then(() => res.json({ message: 'Post deleted successfully' }))
        .catch(next);
}

function _getSchemaRules() {
    const schemaRules = {
        title: Joi.string().empty(''),
        message: Joi.string().empty(''),
        creator: Joi.string().empty(''),
        name: Joi.string().empty(''),
        tags: Joi.array().empty(''),
        selectedFile: Joi.string().empty(''),
        comments: Joi.array().empty(''),
        likes: Joi.array().empty('')
    };

    return schemaRules;
}
