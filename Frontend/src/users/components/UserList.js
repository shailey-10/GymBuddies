import React from 'react';

import './UserList.css';
import UserItem from './UserItem';
import GoalItem from '../../Goals/Components/goal-items';
import Card from '../../shared/components/UIElements/card'
const UserList = props => {
    if(props.items.length === 0){
        return <div className = "Center">
           <Card>
            <h2>No Users Found</h2>
            </Card>
        </div>
    }

    return( 
        <React.Fragment>
    <h2 className = "center"> There are {props.items.length} people in the Gym rn</h2>
    <ul className = "users-list">
        {props.items.map(user => {
                console.log(user.goals)
            return <UserItem
            key = {user.id}
            id = {user.id}
            image = {user.image} 
            name = {user.name} 
            goal =  {user.goals}
        />
        })}
    </ul>
    </React.Fragment>
    )
};

export default UserList;