import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import "../assets/styles/SinglePost.css"

function SinglePost() {
    const location = useLocation();
	//get post data from MainPage
	const post = location.state?.post;
	console.log(post);

    // const { id } = useParams(); // get ID from URL
    // console.log(id);

    return (
        <section className="post">
            <div className="container">
                <div className="single-post">
                    <h1 className="post-title">{post.title}</h1>
                    <img src={post.image} alt={post.title} className="post-image" />
                    <p className="post-content">{post.content}</p>
                </div>
            </div>
        </section>
     
    );
}

export default SinglePost
