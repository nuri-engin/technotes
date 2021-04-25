import React from 'react'

import './style.css';

export default function Card({ post }) {
    console.log('Post', post);

    return (
        <div class="card">
            <div class="header">
                <p>{post.title}</p>
            </div>
            <div class="container">
                <p>ID: {post.id}</p>
                <p>Creator: {`${post.name}`}</p>
                <p>CreatedAt: {`${post.createdAt}`}</p>
                <p>Tags: {post.tags}</p>
                <p>Message: {post.message || "Foo bar zet!"}</p>
                <p>Likes: {post.likes}</p>
            </div>
        </div>
    )
}
