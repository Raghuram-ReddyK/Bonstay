import React, { useState } from 'react'


const Review = () => {
    const [review, setReview] = useState("")
    return (
        <>
            <div className='view' id='rev'>
                <label>Add your review:</label><br />
                <textarea type='textarea' name='review' value={review} onChange={(e) => setReview(e.target.value)} required /><br />
                <button type="submit">Add Review</button>
            </div>
        </>
    )
}

export default Review