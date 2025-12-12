# PHP 8.3 CLI ligero
FROM php:8.3-cli-alpine

WORKDIR /var/www/html

# Instala dependencias necesarias
RUN apk add --no-cache \
    bash \
    git \
    zip \
    libzip-dev \
    libpng-dev \
    oniguruma-dev \
    curl

# Extensiones PHP
RUN docker-php-ext-install pdo pdo_mysql zip gd

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia el proyecto
COPY . .

RUN echo "upload_max_filesize=512M" > /usr/local/etc/php/conf.d/custom.ini \
 && echo "post_max_size=512M" >> /usr/local/etc/php/conf.d/custom.ini \
 && echo "memory_limit=1024M" >> /usr/local/etc/php/conf.d/custom.ini

# Exponer el puerto interno del contenedor
EXPOSE 80

# Comando por defecto: servidor interno de PHP en el contenedor
CMD ["php", "-S", "0.0.0.0:80", "-t", "public"]
