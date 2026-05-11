FROM php:8.5-fpm-alpine
# fix: ensure composer install runs correctly

# Arguments
ARG user=www
ARG uid=1000

# Install system dependencies
RUN apk upgrade --no-cache \
    && apk add --no-cache \
        git \
        curl \
        zip \
        unzip \
        libpng \
        oniguruma \
        libxml2 \
        postgresql-libs \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libpng-dev \
        oniguruma-dev \
        libxml2-dev \
        postgresql-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN addgroup -g $uid -S $user \
    && adduser -u $uid -S -G $user -h /home/$user $user \
    && addgroup $user www-data
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . /var/www

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Build-only tools are not needed at runtime.
RUN apk del .build-deps git curl zip unzip

# Copy existing application directory permissions
RUN chown -R $user:$user /var/www

# Change current user to www
USER $user

# Expose port 8000
EXPOSE 8000
