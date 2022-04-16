import React from "react";
import Button from "../../shared/components/FormElements/button";

import Card from "../../shared/components/UIElements/card";
import UserPostItem from "./userPostItem";
import './userPostList.css';

const UserPostList = props => {
    if(props.items.length === 0){
        return (<div className = "place-list center">
            <Card>
                <h2>No Posts Found. Mayble Add One?</h2>
                <Button to= "/post/new">Add Post</Button>
            </Card>
        </div>)
    }
    return <ul className= "place-list">
        {props.items.map(post => <UserPostItem  
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

export default UserPostList;