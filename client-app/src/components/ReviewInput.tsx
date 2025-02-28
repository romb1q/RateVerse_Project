import React, { useState } from 'react';

interface ReviewInputProps {
  onSubmit: (review: string) => void;
}

const ReviewInput: React.FC<ReviewInputProps> = ({ onSubmit }) => {
  const [review, setReview] = useState<string>('');

  const handleSubmit = () => {
    if (review.trim()) {
      onSubmit(review.trim());
      setReview('');
    }
  };

  return (
    <div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Напишите отзыв"
        rows={4}
      />
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
};

export default ReviewInput;
