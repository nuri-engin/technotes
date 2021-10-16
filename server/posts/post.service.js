const { func } = require('joi');
const db = require('_helpers/db');
const accountService = require('../accounts/account.service');
const CONSTANTS = require('_helpers/constants');

/**
 * Post Service
 */
module.exports = {
    getAll,
    getCount,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getById,
    handleQuery,
    create,
    update,
    handlePatchRequest,
    delete: _delete
};

async function getAll(page = 1) {
    const PAGE_SIZE = 24; // Similar to 'limit'
    const skip = (page - 1) * PAGE_SIZE; // For page 1, the skip is: (1 - 1) * 24 => 0 * 24 = 0
    const posts = await db.PostMessage.find({})
                                      .sort({ _id: -1 })  
                                      .skip(skip)
                                      .limit(PAGE_SIZE);

    return posts.map(x => basicDetails(x));
}

async function getCount() {
    const count = await db.PostMessage.find().estimatedDocumentCount();

    return {
        total: count
    }
}

async function getCategories() {
    const categories = await db.PostCategories.find({});

    return categories
}

async function createCategory(params) {
    const category = new db.PostCategories(params);

    category.createdAt = Date.now();

    // save category
    await category.save();

    return category;
}

async function updateCategory(id, params) {
    if (!id && !params) throw 'Missing parameter OR body values exist!'

    const category = await getCategoryById(id);

    // Dynamically assing the values to the array
    if (confirmSubsField(params, category)) {
        assignSubsToCategory(params, category)
    } 

    // copy params to category
    Object.assign(category, params);

    category.updatedAt = Date.now();

    await category.save();

    return category;
}

async function deleteCategory(id) {
    const category = await getCategoryById(id);
    await category.remove();
}

async function getCategoryById(id) {
    const category = await db.PostCategories.findById(id);
    if (!category) throw 'Category not found';
    return category;
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
    const account = await accountService.getById(params.creatorId);
    
    if (!account) throw 'Could not find the user with provided creator_id';
    const post = new db.PostMessage(params);

    post.createdAt = Date.now();
    post.creatorName = account.userName;

    // save account
    await post.save();

    return basicDetails(post);
}

async function update(id, params) {
    const post = await getPost(id);

    // copy params to account and save
    Object.assign(post, params);

    post.updatedAt = Date.now();

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
        let posts;

        if (!query.searchBy) throw `No any 'searchBy' value provided!`
        if (!query.search && (!query.startDate  || !query.endDate)) throw `No any 'search' value provided!`;

        // Query the 'createdAt' with a date range
        if (confirmCreatedAtQuery(query.searchBy, query.startDate, query.endDate)) {
            posts = await db.PostMessage.find({ 
                createdAt: {
                    $gte: new Date(new Date(query.startDate).setHours(00, 00, 00)),
                    $lt: new Date(new Date(query.endDate).setHours(23, 59, 59))
                }
            }).sort({ createdAt: 'desc'});
        } 
        
        // Query the rest of the fields
        if (query.searchBy !== CONSTANTS.FIELD_NAMES.createdAt) {
            posts = await db.PostMessage.find({
                [query.searchBy]: {
                    $regex: query.search,
                    $options: 'i' 
                } 
            }).sort({ createdAt: 'desc'});    
        }

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

    if (body.action === CONSTANTS.FIELD_NAMES.inc) {
        if (!userHasLike) return insertLike(postId, body.user_id, post);
        throw 'User already has a like!'
    }

    if (body.action === CONSTANTS.FIELD_NAMES.dec) {
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
    const {
        id,
        title,
        message,
        creatorId,
        creatorName,
        category,
        selectedFile,
        tags,
        likes,
        updatedAt,
        createdAt
    } = post;

    return {
        id,
        title,
        message,
        creatorId,
        creatorName,
        category,
        selectedFile,
        tags,
        likes,
        updatedAt,
        createdAt    
    };
}

function confirmCreatedAtQuery(searchBy, startDate, endDate) {
    return (
        searchBy === CONSTANTS.FIELD_NAMES.createdAt &&
        !!startDate &&
        !!endDate
    )
}

function confirmSubsField(params, category) {
    if (params.subs && !Array.isArray(params.subs)) {
        throw "Please provide the sub-categories in an Array, ie: 'subs: [{value: 'The Category name'}]"; 
    }
 
    return (
        (params.subs.length > 0) &&
        (category.subs && category.subs.length > 0)
    );
}

function assignSubsToCategory(params, category) {
    params.subs.forEach(sub => {
        if (subCategoryExist(category, sub.value)) throw "This sub-category already exist!";
        
        category.subs.push(sub);
    });

    delete params.subs;
}

function subCategoryExist(category, value) {
    return category.subs.find(s => s.value === value);
}