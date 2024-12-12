import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../config/supabaseConfig"
import authService from "../../Services/AuthService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from "react-chartjs-2"
import "./DashBoard.css"

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function DashBoard() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [dateLabels, setDateLabels] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const session = await supabase.auth.getSession()
            if (!session.data.session) {
                navigate('/login')
            } else {
                // Fetch balance and history when authenticated
                await fetchBalanceData();
                await authService.getUser().then((data) => {
                    setUser(data.user);
                });
            }
        }
        checkAuth()
    }, [])

    async function goToTransactions() {
        navigate('/transactions')
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message)
            return
        }
        navigate('/login', { replace: true })
    }

    const generateWeeklyMockData = () => {
        const dates = [];
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7); // Last 7 days

        // Generate fixed points for each day of the week
        for (let d = new Date(startOfWeek); d <= now; d.setDate(d.getDate() + 1)) {
            // Create more realistic daily changes (smaller variations)
            const baseAmount = 1000; // Base balance
            const variation = Math.floor(Math.random() * 200) - 100; // -100 to +100 variation
            dates.push({
                created_at: new Date(d).toISOString(),
                type: variation > 0 ? 'receive' : 'send',
                amount: Math.abs(variation)
            });
        }
        return dates;
    };

    const fetchBalanceData = async () => {
        try {
            const mockTransactions = generateWeeklyMockData();
            const dailyBalances = calculateDailyBalances(mockTransactions);
            
            // Format dates as day names
            const labels = dailyBalances.map(item => 
                new Date(item.date).toLocaleDateString('en-US', { 
                    weekday: 'short'
                })
            );
            
            const values = dailyBalances.map(item => item.balance + 1000); // Add base balance

            // Calculate day over day change
            const todayBalance = values[values.length - 1];
            const yesterdayBalance = values[values.length - 2] || todayBalance;
            const change = todayBalance - yesterdayBalance;
            const changePercentage = ((change / yesterdayBalance) * 100).toFixed(1);

            setBalance(todayBalance);
            setBalanceHistory(values);
            setDateLabels(labels);

            return {
                change,
                changePercentage
            };
        } catch (error) {
            console.error('Error setting mock balance:', error);
            return { change: 0, changePercentage: 0 };
        }
    };

    const calculateDailyBalances = (transactions) => {
        const balances = [];
        let currentBalance = 0;
        
        // Group transactions by date and calculate running balance
        const dailyTotals = transactions.reduce((acc, tx) => {
            const date = new Date(tx.created_at).toDateString();
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += tx.type === 'receive' ? tx.amount : -tx.amount;
            return acc;
        }, {});

        // Convert to array and sort by date
        Object.entries(dailyTotals).forEach(([date, amount]) => {
            currentBalance += amount;
            balances.push({
                date,
                balance: currentBalance
            });
        });

        return balances;
    };

    const chartData = {
        labels: dateLabels,
        datasets: [{
            label: 'Balance',
            data: balanceHistory,
            fill: true,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                display: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.03)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    maxTicksLimit: 6,
                    padding: 10,
                    font: {
                        size: 11
                    },
                    callback: (value) => `$${value.toLocaleString()}`
                },
                beginAtZero: false // Don't force y-axis to start at 0
            },
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: 5,
                    font: {
                        size: 11
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                padding: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                callbacks: {
                    label: (context) => `Balance: $${context.raw.toLocaleString()}`,
                    title: (tooltipItems) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (7 - tooltipItems[0].dataIndex));
                        return date.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        });
                    }
                },
                titleFont: {
                    size: 12
                },
                bodyFont: {
                    size: 12
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1 className="logo">CaribePay</h1>
                <div className="nav-actions">
                    <button className="action-btn">Deposit</button>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            
            <div className="trading-layout">
                <div className="welcome-header">
                    <h1>Welcome back, {user?.userName}</h1>
                    <p>Here's your financial overview</p>
                </div>
                
                <div className="chart-container">
                    <div className="price-header">
                        <div className="token-info">
                            <h2>USDC/USD</h2>
                            {/* <span className="market-status">Market Open</span> */}
                        </div>
                        <div className="price-stats">
                            <h1 className="current-price">${balance.toFixed(2)}</h1>
                            {/* <span className="price-change positive">+$25.23 (1.2%) <span className="period">Today</span></span> */}
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
                
                <div className="trading-sidebar">
                    <div className="trading-actions">
                        <button className="trade-btn send">
                            <span className="icon">↑</span>
                            Send USDC
                        </button>
                        <button className="trade-btn receive">
                            <span className="icon">↓</span>
                            Receive USDC
                        </button>
                    </div>
                    <div className="recent-transactions">
                        <div className="section-header">
                            <h3>Recent Transactions</h3>
                            <button onClick={goToTransactions} className="view-all-btn">View All</button>
                        </div>
                        <div className="transactions-list">
                            <div className="transaction-item">
                                <div className="transaction-info">
                                    <span className="icon send">↑</span>
                                    <div className="transaction-details">
                                        <span className="address">0x1234...5678</span>
                                        <span className="time">2 hours ago</span>
                                    </div>
                                </div>
                                <span className="amount negative">-250.00 USDC</span>
                            </div>
                            <div className="transaction-item">
                                <div className="transaction-info">
                                    <span className="icon receive">↓</span>
                                    <div className="transaction-details">
                                        <span className="address">0x8765...4321</span>
                                        <span className="time">5 hours ago</span>
                                    </div>
                                </div>
                                <span className="amount positive">+1,000.00 USDC</span>
                            </div>
                            <div className="transaction-item">
                                <div className="transaction-info">
                                    <span className="icon send">↑</span>
                                    <div className="transaction-details">
                                        <span className="address">0x9876...5432</span>
                                        <span className="time">Yesterday</span>
                                    </div>
                                </div>
                                <span className="amount negative">-50.00 USDC</span>
                            </div>
                            <div className="transaction-item">
                                <div className="transaction-info">
                                    <span className="icon receive">↓</span>
                                    <div className="transaction-details">
                                        <span className="address">0x3456...7890</span>
                                        <span className="time">Yesterday</span>
                                    </div>
                                </div>
                                <span className="amount positive">+150.00 USDC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}