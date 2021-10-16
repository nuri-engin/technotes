const db = require('_helpers/db');
const accountService = require('../accounts/account.service');

/**
 * Post Service
 */
module.exports = {
    getAll,
    getComment,
    getPostmessageComments,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const comments = await db.Comments.find();
    return comments;
}

async function getComment(id) {
    if (!db.isValidId(id)) throw 'Comment not found';

    const comment = await db.Comments.findById(id);

    if (!comment) throw 'Comment not found';

    return comment;
}

async function getPostmessageComments(postmessage_id) {
    const comments = await db.Comments.find({ postmessage_id });

    if (!comments) throw 'No comment found';

    return comments;
}

async function create(params) {
    if (params && params.postmessage_id && params.message && params.creator_id) {
        const account = await accountService.getById(params.creator_id);
        
        if (!account) throw 'Could not find the user with provided creator_id';

        const comment = new db.Comments(params);

        comment.creatorName = account.userName;
        comment.createdAt = Date.now();
    
        // save comment
        await comment.save();
    
        return comment;
    }

    throw 'There is missing information!'
}

async function update(id, params) {
    const comment = await getComment(id);

    // copy params to comment and save
    Object.assign(comment, params);

    comment.updated = Date.now();

    await comment.save();

    return comment;
}

async function _delete(id) {
    const comment = await getComment(id);
    await comment.remove();
}
