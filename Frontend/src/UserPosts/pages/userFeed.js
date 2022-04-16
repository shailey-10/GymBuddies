import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import UserFeedList from "../components/feedList";
import {useHttpClient } from "../../shared/hooks/http-hook";



const UserFeed = () => {
    const [loadedPosts, setLoadedPosts] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    useEffect(() => {
        const fetchPosts = async () => {
            try{
           const responseData = await sendRequest(`http://localhost:5000/api/posts/feed`);
           setLoadedPosts(responseData.posts)
           
         } catch (err){
 
         }
         console.log(loadedPosts)
        };
        fetchPosts();
 
        
     }, [sendRequest])
     const postDeletedHandler = deletedPostId => {
         setLoadedPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId))
         }
    return (
        <React.Fragment>
            <ErrorModal error = {error} onClear = {clearError} />
            {isLoading && (
            <div className = "center">
                <LoadingSpinner />
                </div>
            )}
        { !isLoading && loadedPosts && <UserFeedList items = {loadedPosts} onDeletePost = {postDeletedHandler} />}
        </React.Fragment>
        )
};

export default UserFeed;