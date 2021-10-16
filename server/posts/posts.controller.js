const express = require('express');

const Joi = require('joi');

const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const isEmptyObject = require('_helpers/isEmptyObject');
const postService = require('./post.service');

const validateRequest = require('_middleware/validate-request');

const router = express.Router();

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/count', authorize(Role.Admin), getCount);

router.get('/categories', authorize(Role.Admin), getCategories);
router.post('/categories', authorize(Role.Admin), postCategory);
router.get('/categories/:id', authorize(Role.Admin), getCategoryById);
router.put('/categories/:id', authorize(Role.Admin), updateCategory);
router.delete('/categories/:id', authorize(), deleteCategory);

router.get('/:id', authorize(Role.Admin), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.patch('/:id', authorize(Role.Admin), handlePatchRequest);
router.delete('/:id', authorize(), _delete);

/**
 * Express.js Posts Controller
 */
module.exports = router;

function getAll(req, res, next) {
    try {
        const page = parseInt(req.query.page); // Make sure to parse the page to number

        if (!isEmptyObject(req.query) && !page ) {
            return postService.handleQuery(req.query)
            .then(posts => {
                res.json(posts);
            })
            .catch(next);
        }
    
        return postService.getAll(page)
            .then(posts => {
                res.json(posts);
            })
            .catch(next);   
    } catch (e) {
        return res.status(500).json(e)
    }
}

function getCount (req, res, next) {
    try {    
        return postService.getCount()
            .then(count => {
                res.json(count);
            })
            .catch(next);   
    } catch (e) {
        return res.status(500).json(e)
    }
}

function getCategories (req, res, next) {
    try {    
        return postService.getCategories()
            .then(categories => {
                res.json(categories);
            })
            .catch(next);   
    } catch (e) {
        return res.status(500).json(e)
    }
}

function postCategory(req, res, next) {
    try {    
        postService.postCategory(req.body)
            .then(category => {
                res.json(category);
            })
            .catch(next);   
    } catch (e) {
        return res.status(500).json(e)
    }
}

function updateCategory(req, res, next) {
    try {    
        postService.updateCategory(req.params.id, req.body)
            .then(category => {
                res.json(category);
            })
            .catch(next);   
    } catch (e) {
        return res.status(500).json(e)
    }
}

function getCategoryById(req, res, next) {
    try {    
        postService.getCategoryById(req.params.id)
            .then(category => {
                res.json(category);
            })
            .catch(next);   
    } catch (e) {
        return res.status(500).json(e)
    }
}

function deleteCategory(req, res, next) {
    postService.deleteCategory(req.params.id)
        .then(() => res.json({ message: 'Category deleted successfully' }))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own posts and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    postService.getById(req.params.id)
        .then(post => post ? res.json(post) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object(_getSchemaRules());
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

function handlePatchRequest (req, res, next) {
    postService.handlePatchRequest(req.params.id, req.body)
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
        creatorId: Joi.string().empty(''),
        creatorName: Joi.string().empty(''),
        category: Joi.string().empty(''),
        tags: Joi.array().empty(''),
        selectedFile: Joi.string().empty(''),
        likes: Joi.array().empty(''),
        updatedAt: Joi.date().empty(''),
        createdAt: Joi.date().empty('')
    };

    return schemaRules;
}
