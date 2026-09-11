FROM php:8.3-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libzip-dev \
    && docker-php-ext-install pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

RUN printf '%s\n' \
    'upload_max_filesize=20M' \
    'post_max_size=21M' \
    > /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts

COPY . .

RUN composer dump-autoload --no-dev --optimize

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 8000

CMD ["sh", "-c", "php artisan migrate --force && (php artisan storage:link || true) && php artisan serve --host=0.0.0.0 --port=8000"]