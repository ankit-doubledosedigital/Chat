import { Link, useNavigate } from 'react-router-dom';
import logo from '../components/Assets/TalkNexus.png';
import './Style/Dashboard.css';
import React, { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

const Dashboard = () => {
    const menuRight = useRef(null);
    const toast = useRef(null);
    const navigate = useNavigate(); // useNavigate hook for navigation

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Overview',
                    icon: 'pi pi-microsoft',
                    command: () => { navigate('/overview'); } // Navigate to the Overview page
                },
                {
                    label: 'Setting',
                    icon: 'pi pi-cog',
                    command: () => { navigate('/settings'); } // Navigate to the Settings page
                },
                {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    command: () => { navigate('/profile'); } // Navigate to the Profile page
                },
                // {
                //     label: "Log Out",
                //     icon: "pi pi-sign-out",
                //     command: () => { navigate('/'); } // Navigate to the Logout page
                // },
            ]
        }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="row w-100 align-items-center">
                    <div className="col-md-6 d-flex justify-content-start">
                        <Link to="/" className="navbar-brand d-flex align-items-center">
                            <img src={logo} alt="TalkNexus Logo" style={{ height: '40px', marginRight: '10px' }} />
                            <h1 className="h4 m-0">TalkNexus</h1>
                        </Link>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <div className="card flex justify-content-center">
                            <Toast ref={toast}></Toast>
                            <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                            <Button label="DashBoard" icon=" pi pi-home " className=" btn btn-primary mr-2 text-white text-decoration-none" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Dashboard;
