import {
    LayoutDashboard,
    Table2,
    FilePlus2,
    GitBranch,
    BarChart3,
    Bell,
    LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

const menuSections = [
    {
        title: "OVERVIEW",
        items: [{ label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
    },
    {
        title: "SCHEMES",
        items: [
            { label: "Master Sheet", icon: Table2, path: "/master-sheet" },
            { label: "New Scheme", icon: FilePlus2, path: "/adp-schemes/new" },
            {
                label: "Proposed",
                icon: FilePlus2,
                path: "/master-sheet?approvalStatus=PROPOSED",
            },
            { label: "PC-1 Pipeline", icon: GitBranch, path: "/pipeline" },
        ],
    },
    {
        title: "MONITORING & REPORTS",
        items: [
            { label: "Global Reports", icon: BarChart3, path: "/reports" },
            { label: "Alerts", icon: Bell, badge: 0, path: "/dashboard" },
        ],
    },
];

export default function Sidebar() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">A</div>
                    <div>
                        <h2>ADP Portal</h2>
                        <p>HEALTH DEPT, GOS</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuSections.map((section) => (
                        <div key={section.title} className="sidebar-section">
                            <p className="sidebar-section-title">{section.title}</p>

                            <div className="sidebar-menu">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.label}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `sidebar-item ${isActive ? "active" : ""}`
                                            }
                                        >
                                            <span className="sidebar-item-left">
                                                <Icon size={18} />
                                                <span>{item.label}</span>
                                            </span>

                                            {item.badge !== undefined && (
                                                <span className="sidebar-badge">{item.badge}</span>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="sidebar-bottom">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">Us</div>
                    <div>
                        <h3>Minister</h3>
                        <p>MOH OFFICE</p>
                    </div>
                </div>

                <button className="signout-btn" onClick={handleSignOut} type="button">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}