---
title: Локальный сервер на HTTPS (без установки библиотек на вашу машину 😉)
date: 2022-11-20
author: Toby
description: Dundir Mufflin, this is Pam
draft: false
category: JavaScript
slug: localhost-https-soviet
---

# Локальный сервер на HTTPS (без установки библиотек на вашу машину 😉)

В ходе разработки того или иного приложения клиентская часть во многом зависит от сервера.
Фронтэнд делает запросы и обрабатывает ответы соответсвенно. В некоторых случаях при использовании
сторонних API требуется защищенное SSL соединение и это конечно приносит неудобства в виде тестирования
клиентской части.

Сегодня мы рассмотрим как получить SSL-сертификат для вашего локального сервера.

Пререквизиты:
  - Docker Desktop
  - NodeJS

Перед тем как начать писать какие-либо команды, давайте мы вам покажем с помощью диаграм и схем как это работает.

![scheme](../../../../images/localhost-https/01.png)

## docker compose
Запускаем всю магию с помощью команды `docker compose up`

```yaml
# ./docker-compose.yml

version: '3.8'
services:
  frontend:
    container_name: frontend
    build: ./frontend
    ports:
      - 3000:3000
    volumes:
      - ./frontend:/app

  proxy:
    container_name: proxy
    build: ./proxy
    volumes:
      - proxy-dhparams:/var/proxy
      - ssl-certs:/etc/nginx/certs
      - web:/var/www
    ports:
      - 80:80
      - 443:443
    depends_on:
      - frontend

volumes:
  proxy-dhparams:
  ssl-certs:
  web:

```

## Клиентская часть
Допустим ваш фронтэнд написан на nextjs. Создаём приложение с помощью команды:

```sh
npx create-next-app@latest frontend
```

Далее его надо докеризировать с помощью Dockerfile. Для этого создаём Dockerfile в папке приложения:

```dockerfile
# ./frontend/Dockerfile

FROM node:18-slim

WORKDIR /app

COPY package.json yarn.lock ./app/

RUN yarn install --frozen-lockfile

COPY . ./app

EXPOSE 3000

CMD ["yarn", "dev"]
```

Образ фронтэнд приложения примитивен и думаем не нуждается в особых объяснениях.

## Прокси
Львиная доля процесса происходит в `proxy` образе. Создаём `Dockerfile` для `proxy` сервиса:

```dockerfile
# ./proxy/Dockerfile

FROM nginx:1.23.0-alpine

COPY ./nginx/* /etc/nginx/

COPY ./run.sh /run.sh

RUN apk add --no-cache openssl bash

RUN chmod +x /run.sh

CMD [ "/run.sh" ]
```

В этом файле мы:
  - Создаём `docker-image` на основе образа `nginx`.
  - Копируем файлы конфигурации и скрипт из папки нашего проекта в `docker-image`.
  - Устанавливаем `openssl` и `bash`. `openssl` требуется для генерации `dh` параметров, а `bash` используется для запуска нашего скрипта `run.sh`.
  - Делаем файл `run.sh` исполняемым.
  - Установим команду `/run.sh`, чтобы нам не нужно было указывать ее при запуске контейнеров из нашего образа.

При запуске нашего прокси-сервиса первым делом выполняется shell-скрипт из файла `run.sh`. В этом скрипте выполняются следующие действия:
- создание приватного ключа с помощью шифрования Diffie-Hellman parameters
- создание приватного ключа + самоподписанного сертификата для локального хоста

Давайте сперва разберем код по строчке и дальше мы вам скажем зачем мы это делаем в принципе.

```bash
#!/bin/bash
```

это называется shebang или hashbang и это специальная директива, которая идет всегда и исключительно в начале файла скрипта, тем самым указывает операционнай системе, какой интерпретатор использовать для выполнения скрипта.
В вышеуказанном примере скрипт будет выполняется в оболочке Bash.

```bash
set -e
```

это команда также специальная директива, которая позволяет остановливать чтение скрипта при первой ошибке. Основная задача `set -e` это гарантированно ловить ошибку и выходить из программы не дав интерпретару продолжения чтения скрипта, так как это может привезсти к неожиданным результатам.

Теперь мы приступаем к основной части нашего скрипта.

```bash
# ./proxy/run.sh

if [ ! -f "/etc/nginx/certs/localhost.crt" ]; then
  echo "No SSL cert - creating it"
  
  openssl req -x509 -out /etc/nginx/certs/localhost.crt \
    -keyout /etc/nginx/certs/localhost.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
fi
```

Проверка на наличие SSL-сертификата и ключа для локального сервера. 
- openssl req - запрос на создание и подпись сертификата
- x509 - указание создать самоподписанный сертификат

```bash
# ./proxy/nginx/default.conf.tpl

server {
  listen 443 ssl;
  server_name localhost;

  ssl_certificate /etc/nginx/certs/localhost.crt;
  ssl_certificate_key /etc/nginx/certs/localhost.key;

  add_header Strict-Transport-Security "max-age=31536000" always;

  location / {
    proxy_pass http://frontend:3000;
    
    include /etc/nginx/proxy_params;
  }
}
```

Конфигурация прокси сервиса на nginx для прослушивания защищенных запросов на порту 443 с использованием SSL указывая на сертификат и ключ. Дополнительно усиливая защиту с помощью параметров 

```
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```
