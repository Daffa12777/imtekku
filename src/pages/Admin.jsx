import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminHtml } from './AdminBody';
import '../assets/css/pages/admin-page.css';

const Admin = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const isAdmin = window.ImtekkuStore.getItem('adminLoggedIn') === 'true';
        if (!isAdmin) {
            navigate('/');
            return;
        }
        setIsLoaded(true);

        window.logout = () => {
            window.ImtekkuStore.removeItem('adminLoggedIn');
            window.location.href = '/';
        };

        // Delay loading the script slightly so DOM is ready
        const timer = setTimeout(() => {
            const script = document.createElement('script');
            // Adding a timestamp ensures the browser executes the IIFE again if the user navigates back to /admin
            script.src = '/js/admin-page.js?t=' + Date.now();
            // Assign an ID so we can easily remove it later
            script.id = 'admin-page-script';
            document.body.appendChild(script);
        }, 100);

        return () => {
            clearTimeout(timer);
            const scriptEl = document.getElementById('admin-page-script');
            if (scriptEl) document.body.removeChild(scriptEl);
            delete window.logout;
        };
    }, [navigate]);

    if (!isLoaded) return null;

    return (
        <div
            className="admin-page-container"
            dangerouslySetInnerHTML={{ __html: adminHtml }}
        />
    );
};

export default Admin;
