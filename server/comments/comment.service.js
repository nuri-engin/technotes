const db = require('_helpers/db');

/**
 * Post Service
 */
module.exports = {
    getAll,
    getComment,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const comments = await db.Comments.find();
    return comments.map(x => basicDetails(x));
}

async function create(params) {
    const comment = new db.Comments(params);

    comment.createdAt = Date.now();

    // save account
    await comment.save();

    return basicDetails(comment);
}

async function update(id, params) {
    const post = await getPost(id);

    // copy params to account and save
    Object.assign(post, params);

    post.updated = Date.now();

    await post.save();

    return basicDetails(post);
}

async function _delete(id) {
    const post = await getPost(id);
    await post.remove();
}

async function getComment(id) {
    if (!db.isValidId(id)) throw 'Comment not found';
    const comment = await db.Comments.findById(id);
    if (!comment) throw 'Comment not found';
    return comment;
}

// helper functions
function basicDetails(comment) {
    const { id, postmessage_id, creator, message, updated, createdAt  } = comment;
    return { id, postmessage_id, creator, message, updated, createdAt };
}