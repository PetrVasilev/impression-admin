import './style.scss'

import React from 'react'
import { Site, Icon } from 'tabler-react'
import { Link } from 'react-router-dom'

const Header = ({ moderator = {} }) => {
    const handleLogout = () => {
        localStorage.clear()
        window.open('/login', '_self')
    }

    return (
        <Site.Header>
            <div className="header-container">
                <Link to="/">
                    <img src={'/logo-vertical.png'} alt="inVoyager" className="logo hovering" />
                </Link>
                <div className="right">
                    <div className="name">{moderator.login}</div>
                    <div onClick={handleLogout} className="logout hovering">
                        <Icon prefix="fe" name="log-out" />
                    </div>
                </div>
            </div>
        </Site.Header>
    )
}

export default Header
