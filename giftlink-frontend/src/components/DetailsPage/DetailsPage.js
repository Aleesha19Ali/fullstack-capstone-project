import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Authentication Check
        const authToken = sessionStorage.getItem('auth-token');
        if (!authToken) {
            navigate('/app/login');
            return;
        }

        window.scrollTo(0, 0);

        const fetchGiftDetails = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Gift not found');
                }
                const data = await response.json();
                setGift(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGiftDetails();
    }, [productId, navigate]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!gift) return null;

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card">
                <div className="image-placeholder-large">
                    {gift.image ? (
                        <img src={gift.image} alt={gift.name} className="product-image-large" />
                    ) : (
                        <div className="no-image-available-large">No Image Available</div>
                    )}
                </div>
                <div className="card-body">
                    <h2 className="details-title">{gift.name}</h2>
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {formatDate(gift.date_added)}</p>
                    <p><strong>Age (Years):</strong> {gift.age_years}</p>
                    <p><strong>Description:</strong> {gift.description}</p>
                    
                    <div className="comments-section">
                        <h4>Comments</h4>
                        {gift.comments && gift.comments.length > 0 ? (
                            gift.comments.map((comment, index) => (
                                <div key={index} className="card mb-2 p-2">
                                    <p className="mb-0"><strong>{comment.author}:</strong> {comment.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;