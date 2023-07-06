---
title: Локальный сервер на HTTPS (без установки библиотек на вашу машину 😉)
date: 2022-11-20
author: Toby
description: Dundir Mufflin, this is Pam
draft: false
category: JavaScript
slug: https
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
Львиная доля процесса происходит в proxy образе. Давайте рассмотрим Dockerfile proxy сервиса:

```dockerfile
# ./proxy/Dockerfile

FROM nginx:1.23.0-alpine

COPY ./nginx/* /etc/nginx/

COPY ./run.sh /run.sh

USER root

RUN apk add --no-cache openssl bash

RUN chmod +x /run.sh

CMD [ "/run.sh" ]
```

При запуске нашего прокси-сервиса первым делом выполняется shell-скрипт из файла `run.sh`. В этом скрипте выполняются следующие действия:
- создание приватного ключа с помощью шифрования Diffie-Hellman parameters
- создание приватный ключа + самоподписанного сертификата для локального хоста

Давайте сперва разберем код по строчке и дальше мы вам скажем зачем мы это делаем в принципе.

```
#!/bin/bash
```

это называется shebang или hashbang и это специальная директива, которая идет всегда и исключительно в начале файла скрипта, тем самым указывает операционнай системе, какой интерпретатор использовать для выполнения скрипта.
Вышеуказанном примере скрипт будет выполняется в оболочке Bash.

```
set -e
```

это команда также специальная директива, которая позволяет остановливать чтение скрипта при первой ошибке. Основная задача `set -e` это гарантированно ловить ошибку и выходить из программы не дав интерпретару продолжения чтения скрипта, так как это может привезсти к неожиданным результатам.

Теперь мы пристумаем к основной части нашего скрипта.

```
if [ ! -f "/var/proxy/ssl-dhparams.pem" ]; then
echo "dhparams.pem does not exist - creating it"
openssl dhparam -out /var/proxy/ssl-dhparams.pem 2048
fi
```

Проверка есть ли у нас в директори /var/proxy/ssl-dhparams.pem параметры Diffie-Hellman, и при отсутствии мы создаем его с помощью openssl команды с параметром dhparam с длинною 2048 бит.