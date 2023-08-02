---
layout: ../../../layouts/PostLayout.astro
title: Локальный сервер на https
date: 2023-07-30
author: Dinmukhamed Sailaubek, Olzhas Kurikov
description: Dundir Mufflin, this is Pam
draft: false
category: JavaScript
slug: localhost-https-soviet
tags: ['javascript', 'nginx', 'docker']
code-block-font-size: \tiny
---

В ходе разработки того или иного веб-приложения, клиентская часть во многих случаях зависит от сервера; клиент отправляет запросы и обрабатывает ответы.
В некоторых случаях при использовании
сторонних `API` (Facebook, Gmail, Twitter и т.д.) требуется защищенное `SSL` соединение и это конечно приносит неудобства в виде тестирования, запуска фронтэнд приложения на локальной машине. Исходя из этого мы бы хотели вам показать как получить самоподписанный `SSL-сертификат` для вашего локального сервера.

> Для продакшн использование самоподписанных сертификатов не рекомендуется. Подобные сертификаты не обеспечивают надежной защиты и не признаются учреждениями сертификации.

Самоподписанные SSL сертификаты вам пригодятся в следующих случаях:

- локальная разработка и тестирование
- прототипирование и демонстрация концепций
- образовательные и учебные цели

## TL;DR

У нас будут `два сервиса`, точнее два докер-образа; первое это любое приложения для клиентской части и второе прокси сервер для получения SSL сертификата, приватного ключа и перенаправление трафика на защищенный канал. Краткую схему всего процесса можете увидеть внизу.

![scheme](../../../../images/localhost-https/02.png)

## Пререквизиты:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [NodeJS](https://nodejs.org/en)

Прежде чем погрузиться в описание самого процесса работы, хотелось бы показать из каких частей оно состоит.

### Файловая структура

```
├── docker-compose.yml
├── frontend (react / nextjs / vue / svelte) - 1st service
│   ├── Dockerfile
│   └── ...
└── proxy - 2nd service
    ├── Dockerfile
    ├── nginx
    │   ├── default.conf.tpl
    │   └── proxy_params
    └── run.sh
```

## docker compose

Запускаем всю магию с помощью команды `docker compose up`

```yaml
# ./docker-compose.yml

version: '3.8'
services:
  # 1st service
  frontend:
    container_name: frontend
    build: ./frontend
    ports:
      - 3000:3000
    volumes:
      - ./frontend:/app

  # 2nd service
  proxy:
    container_name: proxy
    build: ./proxy
    volumes:
      - ssl-certs:/etc/nginx/certs
    ports:
      - 443:443
    depends_on:
      - frontend

volumes:
  ssl-certs:
```

## Клиентская часть (Frontend Service)

В этом блоге используется клиентская часть на NextJS, но вы также можете выбрать любой другой фреймворк по вашему усмотрению.

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

## Прокси (Proxy Service)

Львиная доля процесса происходит в `proxy` образе.

```dockerfile
# ./proxy/Dockerfile

FROM nginx:1.23.0-alpine

COPY ./nginx/* /etc/nginx/

COPY ./run.sh /run.sh

RUN apk add --no-cache openssl bash

RUN chmod +x /run.sh

CMD [ "/run.sh" ]
```

При запуске нашего прокси-сервиса первым делом выполняется shell-скрипт из файла `run.sh`. В этом скрипте создается `приватный ключ + самоподписанный сертификат` для локального сервиса.

Скрипт в файле `run.sh` генерирует самоподписанный сертификат для домена localhost c помощью команды OpenSSL. При созданий, сертификат сохраняется в файл `/etc/nginx/certs/localhost.crt`, а приватный ключ в `/etc/nginx/certs/localhost.key`.

Давайте сперва разберем код по строчке и далее мы вам скажем зачем мы это делаем в принципе.

```bash
# ./proxy/run.sh

if [ ! -f "/etc/nginx/certs/localhost.crt" ]; then
  echo "No SSL cert - creating it"

  openssl req -x509 -out /etc/nginx/certs/localhost.crt \
    -keyout /etc/nginx/certs/localhost.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' \
    -extensions EXT \
    -config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
fi
```

Проверка на наличие SSL-сертификата и ключа для локального сервера.

- openssl req - запрос на создание и подпись сертификата
- x509 - указание создать самоподписанный сертификат
- rsa - метод шифрования для создания ключа

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

При использовании веб-сервера `nginx` `server` блоки можно использовать для инкапсуляции конфигурационных деталей и размещения более одного домена на одном сервере.

В нашем случае в блоке `server` `nginx` прослушивает защищенный порт 443 для всех запросов с помощью директивы `listen` и направит запросы в `http://frontend:3000` (директива `proxy_pass`).

В файле `proxy_params` установлены заголовки запроса:

```bash
# ./proxy/nginx/proxy_params

proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

Ссылка на репозиторий: https://github.com/evitla/nextjs-https
