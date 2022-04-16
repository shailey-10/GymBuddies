import React from "react";

import Card from "../../shared/components/UIElements/card";
import UserFeedItem from "./feedItem";
import Button from "../../shared/components/FormElements/button";
import './userPostList.css';

const UserFeedList = props => {
    if(props.items.length === 0){
        return (<div className = "place-list center">
            <Card>
                <h2>No Posts Found. Mayble Add One?</h2>
                <Button to= "/post/new">Add Post</Button>
            </Card>
        </div>)
    }

    return <ul className= "place-list">
        {props.items.map(post => <UserFeedItem  
        key = {post.id}
        id = {post.id}
        image = {post.image}
        title = {post.title}
        description = {post.description}
        creatorId = {post.creator} 
        onDelete = {props.onDeletePost}
        />)}
    </ul>
    
    
};

export default UserFeedList;