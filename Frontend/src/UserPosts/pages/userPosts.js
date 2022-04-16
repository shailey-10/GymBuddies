import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import UserPostList from "../components/userPostList";
import {useHttpClient } from "../../shared/hooks/http-hook";

const UserPost = () => {
    const [loadedPosts, setLoadedPosts] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const userId = useParams().userId;
    useEffect(() => {
       const fetchPosts = async () => {
           try{
               console.log(userId)
          const responseData = await sendRequest(`http://localhost:5000/api/posts/user/${userId}`);
          setLoadedPosts(responseData.posts)
          
        } catch (err){

        }
        console.log(loadedPosts)
       };
       fetchPosts();

       
    }, [sendRequest, userId])
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
    { !isLoading && loadedPosts && <UserPostList items = {loadedPosts} onDeletePost = {postDeletedHandler} />}
    </React.Fragment>
    )
};

export default UserPost;