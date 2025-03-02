// src/components/GameHistory.js
import React, { useState, useEffect } from 'react';
import { getUserHistory } from '../services/api';

const GameHistory = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.user_id) {
                    setError('Please log in to view game history');
                    return;
                }

                const response = await getUserHistory(user.user_id);
                setHistory(response.data.history);
                setStats(response.data.stats);
            } catch (err) {
                setError('Failed to load game history');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="text-center text-white">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Game History</h2>
                    
                    {/* Stats Summary */}
                    {stats && (
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h3 className="text-gray-300 text-sm">Total Games</h3>
                                <p className="text-2xl font-bold text-white">{stats.total_games}</p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h3 className="text-gray-300 text-sm">Average Score</h3>
                                <p className="text-2xl font-bold text-white">{stats.average_score}</p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                                <h3 className="text-gray-300 text-sm">Average Attempts</h3>
                                <p className="text-2xl font-bold text-white">{stats.average_attempts}</p>
                            </div>
                        </div>
                    )}

                    {/* History Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-gray-300 border-b border-gray-700">
                                    <th className="py-2 px-4 text-left">Date</th>
                                    <th className="py-2 px-4 text-left">Score</th>
                                    <th className="py-2 px-4 text-left">Attempts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map((game, index) => (
                                        <tr key={index} className="border-b border-gray-700/50 text-white">
                                            <td className="py-2 px-4">{game.date}</td>
                                            <td className="py-2 px-4">{game.score}</td>
                                            <td className="py-2 px-4">{game.attempts}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-gray-400">
                                            No game history found. Play some games to see your history!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameHistory;