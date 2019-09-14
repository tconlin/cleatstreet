
import React from 'react'

import backgroundImg from './assets/field-background.jpg'
import FirebaseLogin from "./index";

export default class Flogin extends React.Component {
    render() {
        return (
            <FirebaseLogin 
            login={user => console.log(user)}
            background={backgroundImg}
            />
        )
    }
}