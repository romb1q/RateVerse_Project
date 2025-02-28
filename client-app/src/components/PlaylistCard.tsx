import React from "react";
import styles from "../styles/PlaylistCard.module.scss";

interface PlaylistCardProps {
  name: string;
  description?: string;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  name,
  description,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={styles.card}
      onClick={onClick}
    >
      <div className={styles.leftBar}></div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description || "Нет описания"}</p>
      </div>
      <div className={styles.actions}>
        {onEdit && (
          <button
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
          >
            Изменить
          </button>
        )}
        {onDelete && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
