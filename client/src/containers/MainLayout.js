import React from 'react'

import Card from '../components/Card';

export default function MainLayout({ posts }) {

    console.log('Upcoming posts: ', posts);

    return (
        <div className="main-layout-wrapper">
            <div>
                Header
            </div>
            <div
                style={{
                    height: '900px',
                    padding: '10px',
                    width: '100 %',
                    margin: '10px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <div
                    style={{
                        border: '1px solid #ccc',
                        width: '70%'
                    }}
                >
                    {
                        !!posts && posts.map(post => {
                           return (
                                <Card post={post} />
                            )
                        })
                    }
                </div>
                <div
                    style={{
                        border: '1px solid #ccc',
                        width: '30%'
                    }}
                >
                    Post inputs
                </div>
            </div>
        </div>
    )
}
