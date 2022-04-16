import React from 'react';
import { Link } from 'react-router-dom';

import './UserItem.css';
import UserList from './UserList'
import Avatar from '../../shared/components/UIElements/avatar'
import Card from '../../shared/components/UIElements/card';

const UserItem = props => {   
    // const userGoals = props.goal.map((d) => <li key={d.name}>
    //     <div className = "goal-container">
    // <img className = "icon" src={d.image} /> <p>{d.name}</p>
    // </div>
    // </li>);

    return (
        <li className = "user-item">
           
            <Card className = "user-item__content">
            <Link to = {`/${props.id}/posts`}>

                <div className ="user-item__image">
                    <Avatar image = {`http://localhost:5000/${props.image}`} alt = {props.name} />
                </div>
                <div className = "user-item__info">
                    <h2>{props.name}</h2>
                    {/* <div className = "goals-display">
                        {userGoals} 
                    </div> */}
                </div>
                </Link>
                </Card>

        </li>
    );
};

export default UserItem;