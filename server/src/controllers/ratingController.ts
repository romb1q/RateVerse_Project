import { Request, Response } from 'express';
import Rating from '../models/Rating';

// Создать рейтинг
export const createOrUpdateRating = async (req: Request, res: Response): Promise<void> => {
    const { RatingUserID, RatingContentID, RatingScore } = req.body;

    if (!RatingUserID || !RatingContentID || !RatingScore) {
        res.status(400).json({ message: 'Необходимо указать все поля' });
        return;
    }

    try {
        const existingRating = await Rating.findOne({
            where: { RatingUserID, RatingContentID },
        });

        if (existingRating) {
            // Обновляем существующий рейтинг
            existingRating.RatingScore = RatingScore;
            await existingRating.save();
            res.status(200).json({ message: 'Рейтинг обновлён', rating: existingRating });
        } else {
            // Создаём новый рейтинг
            const rating = await Rating.create({
                RatingUserID,
                RatingContentID,
                RatingScore,
                RatingDate: new Date(),
            });
            res.status(201).json({ message: 'Рейтинг создан', rating });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при создании или обновлении рейтинга', error });
    }
};


// Получить рейтинг контента
export const getRatingsByContent = async (req: Request, res: Response): Promise<void> => {
    const { contentId } = req.params;

    try {
        const ratings = await Rating.findAll({ where: { RatingContentID: contentId } });
        res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка получения рейтингов', error });
    }
};

// Получить рейтинг пользователя для контента
export const getUserRatingForContent = async (req: Request, res: Response): Promise<void> => {
    const { userId, contentId } = req.params;

    try {
        const rating = await Rating.findOne({
            where: { RatingUserID: userId, RatingContentID: contentId },
        });

        if (!rating) {
            res.status(404).json({ message: 'Рейтинг не найден' });
            return;
        }

        res.status(200).json(rating);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка получения рейтинга', error });
    }
};

// Обновить рейтинг
export const updateRating = async (req: Request, res: Response): Promise<void> => {
    const { ratingId } = req.params;
    const { RatingScore } = req.body;

    try {
        const [rowsUpdated] = await Rating.update(
            { RatingScore },
            { where: { RatingID: ratingId } }
        );

        if (!rowsUpdated) {
            res.status(404).json({ message: 'Рейтинг не найден' });
            return;
        }

        res.status(200).json({ message: 'Рейтинг обновлён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка обновления рейтинга', error });
    }
};

// Удалить рейтинг
export const deleteRating = async (req: Request, res: Response): Promise<void> => {
    const { ratingId } = req.params;

    try {
        const rowsDeleted = await Rating.destroy({ where: { RatingID: ratingId } });

        if (!rowsDeleted) {
            res.status(404).json({ message: 'Рейтинг не найден' });
            return;
        }

        res.status(200).json({ message: 'Рейтинг удалён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка удаления рейтинга', error });
    }
};
