const db = require('_helpers/db');

/**
 * Post Service
 */
module.exports = {
    getAll,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const posts = await db.PostMessage.find();
    return posts.map(x => basicDetails(x));
}

async function create(params) {
    const post = new db.PostMessage(params);

    post.createdAt = Date.now();

    // save account
    await post.save();

    return basicDetails(post);
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

// helper functions
async function getPost(id) {
    if (!db.isValidId(id)) throw 'Post not found';
    const post = await db.PostMessage.findById(id);
    if (!post) throw 'Post not found';
    return post;
}

function basicDetails(post) {
    const { id, title, name, messsage, creator, selectedFile, createdAt, updated, tags, likes, comments } = post;
    return { id, title, name, messsage, creator, selectedFile, createdAt, updated, tags, likes, comments };
}