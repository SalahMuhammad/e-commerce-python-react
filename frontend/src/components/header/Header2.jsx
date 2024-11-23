// src/components/Sidebar/Sidebar.jsx
import { Navbar, Nav, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faHome,
    faUser,
    faChartLine,
    faGear,
    faSignOut,
    faCaretDown,
    faCaretUp
} from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdowns, setActiveDropdowns] = useState({});

    const toggleSidebar = () => setIsOpen(!isOpen);

    const toggleDropdown = (key) => {
        setActiveDropdowns(prev => ({
            //   ...prev,
            [key]: !prev[key]
        }));
    };

    const menuItems = [
        {
            title: 'الاصناف',
            icon: faHome,
            items: [
                { title: 'ادارة الاصناف', path: '/items' },
                { title: 'اٍنشاء صنف', path: '/items/add' },
                { title: 'تحديد نسب الربح', path: '/items/edit-profit-percentages' }
            ]
        },
        {
            title: 'الفواتير',
            icon: faUser,
            items: [
                { title: 'ادارة الفواتير', path: '/invoices' },
                { title: 'اٍنشاء فاتوره', path: '/invoices/crud' },
            ]
        },
        {
            title: 'المخازن',
            icon: faChartLine,
            items: [
                { title: 'ادارة المخازن', path: '/repositories' },
                { title: 'اٍنشاء مخزن', path: '/repositories/add' },
            ]
        },
        {
            title: 'العملاء/الموردين',
            icon: faGear,
            items: [
                { title: 'اداره العملاء و الموردين', path: '/clients-suppliers' },
                { title: 'اٍنشاء عميل/مورد', path: '/clients-suppliers/add' },
            ]
        },
        {
            title: 'Logout',
            icon: faSignOut,
            items: [
                { title: 'Lock Screen', path: '/auth/lock' },
                { title: 'Sign Out', path: '/auth/logout' }
            ]
        }
    ];

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link>
                        <img src="/your-logo.png" alt="Logo" className="logo" />
                        <button className="toggle-btn d-lg-none" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </Link>
                </div>

                <Nav className="flex-column">
                    {menuItems.map((item, index) => (
                        <div key={index} className="nav-item-container">
                            <div
                                className="sidebar-link"
                                onClick={() => toggleDropdown(index)}
                            >
                                <div className="link-content">
                                    <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                                    <span className="link-text">{item.title}</span>
                                </div>
                                <FontAwesomeIcon
                                    icon={activeDropdowns[index] ? faCaretUp : faCaretDown}
                                    className="dropdown-icon"
                                />
                            </div>

                            <Collapse in={activeDropdowns[index]}>
                                <div>
                                    {item.items.map((subItem, subIndex) => (
                                        <Nav.Link
                                            as={Link}
                                            key={subIndex}
                                            to={subItem.path}
                                            className="dropdown-item"
                                        >
                                            {subItem.title}
                                        </Nav.Link>
                                    ))}
                                </div>
                            </Collapse>
                        </div>
                    ))}
                </Nav>
            </div>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
        </>
    );
};

export default Sidebar;