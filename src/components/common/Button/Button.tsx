import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from './types';
import styles from './Button.module.css';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  ...rest
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.disabled]: disabled,
          [styles.loading]: loading,
          [styles.fullWidth]: fullWidth,
        },
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      {loading && <span className={styles.loader} />}
      <span className={styles.content}>{children}</span>
    </button>
  );
};

Button.displayName = 'Button';