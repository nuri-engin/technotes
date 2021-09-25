const { func } = require('joi');
const db = require('_helpers/db');

/**
 * Post Service
 */
module.exports = {
    getAll,
    getById,
    handleQuery,
    create,
    update,
    handlePatchRequest,
    delete: _delete
};

async function getAll() {
    const posts = await db.PostMessage.find();
    return posts.map(x => basicDetails(x));
}

async function getById(id) {
    const post = await getPost(id);
    return basicDetails(post);
}

async function getPost(id) {
    if (!db.isValidId(id)) throw 'Post not found';
    const post = await db.Post.findById(id);
    if (!post) throw 'Post not found';
    return post;
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

async function insertLike (postId, user_id, post) {
    post.likes.push(user_id);
    
    await db.PostMessage.findByIdAndUpdate(postId, post, {
        new: true
    })

    return basicDetails(post);
}

async function removeLike(postId, user_id, post) {
    const filteredLikes = post.likes.filter(like => like !== user_id);
    
    post.likes = filteredLikes;

    await db.PostMessage.findByIdAndUpdate(postId, post, {
        new: true
    })

    return basicDetails(post);
}


/**
 * Providing 'searchBy' functionality;
 * 
 * Here we apply a regex based search logic to let the query
 * to match all records with ignoring case-sensitive aspect.
 * 
 * @param {Object} query The native express-query object.
 */
 async function handleQuery(query) {
    if (!!query.searchBy || !!query.search) {
        if (!query.searchBy) throw `No any 'searchBy' value provided!`
        if (!query.search) throw `No any 'search' value provided!`;

        const posts = await db.PostMessage.find({
            [query.searchBy]: {
                $regex: query.search,
                $options: 'i' 
            } 
        });

        if (!posts) throw 'Posts not found';

        return posts.map(x => basicDetails(x));
    }

    throw 'No any search query provided!'
}

async function handlePatchRequest (postId, body) {
    if (body.user_id && body.action) {
        return handleLikeRequest(postId, body)
    }

    throw 'TechNotes API only response for LIKES based patch requests (for now!).'
}

async function handleLikeRequest (postId, body) {
    const post = await getPost(postId);
    const userHasLike = post.likes.includes(body.user_id);

    if (body.action === 'inc') {
        if (!userHasLike) return insertLike(postId, body.user_id, post);
        throw 'User already has a like!'
    }

    if (body.action === 'dec') {
        if (userHasLike) return removeLike(postId, body.user_id, post) 
        throw 'User already has not any like!'
    }
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
    const { id, title, name, message, creator, selectedFile, createdAt, updated, tags, likes, comments } = post;
    return { id, title, name, message, creator, selectedFile, createdAt, updated, tags, likes, comments };
}