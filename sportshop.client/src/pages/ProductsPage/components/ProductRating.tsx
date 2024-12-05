import { StarIcon as FullStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';

interface RatingProps {
    rating: number;
    totalStars?: number;
    editable?: boolean;
    onChange?: (rating: number) => void;
}

const Rating = ({ rating, totalStars = 5, editable = false, onChange }: RatingProps) => {
    const handleRatingClick = (index: number) => {
        if (editable && onChange) {
            onChange(index + 1);
        }
    };

    return (
        <div className="flex items-center space-x-1">
            {[...Array(totalStars)].map((_, index) => (
                <button
                    key={index}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleRatingClick(index)}
                >
                    {index < rating ? (
                        <FullStar className="h-6 w-6 text-yellow-400" />
                    ) : (
                        <OutlineStar className="h-6 w-6 text-gray-300" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default Rating;