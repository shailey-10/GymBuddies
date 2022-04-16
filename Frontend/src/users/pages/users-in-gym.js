import React, {useEffect, useState} from 'react';

import UsersList from '../components/UserList';
import ErrorModal from '../../shared/components/UIElements/errorModal';
import LoadingSpinner from '../../shared/components/UIElements/loadingSpinner';
import Button from '../../shared/components/FormElements/button';
import {useHttpClient} from '../../shared/hooks/http-hook';


const Users = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            
            try{
        const responseData = await sendRequest('http://localhost:5000/api/admin/users-in-gym');

        setLoadedUsers(responseData.user);
      }catch (err){
    
    }
        };
        fetchUsers()

    }, [sendRequest]);


    

    return <React.Fragment>
        <ErrorModal error = {error} onClear = {clearError} />
        {isLoading  && (
            <div className="center">
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedUsers && <UsersList items = {loadedUsers} />}
        </React.Fragment>
};

export default Users;