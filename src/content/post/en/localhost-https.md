---
layout: ../../../layouts/PostLayout.astro
title: HTTPS for your localhost
date: 2022-11-20
author: Toby
description: Dundir Mufflin, this is Pam
draft: false
category: JavaScript
slug: https-wild-west
tags: ['javascript', 'nginx', 'docker']
heroImageUrl: /images/localhost-https/hero.png
---

During the development of a web application, the client-side often relies on the server; the client sends requests and processes responses. In some cases, when using third-party APIs like Facebook, Gmail, Twitter, etc., a secure SSL connection is required, which can be inconvenient while testing and running the frontend application on a local machine.

Based on this, we would like to show you how to obtain a self-signed SSL certificate for your local server.

P.S. For production use, self-signed certificates are not recommended. Such certificates do not provide reliable security and are not recognized by certification authorities.

Self-signed SSL certificates can be useful in the following scenarios:

- local development and testing.
- prototyping and demonstrating concepts.
- educational and learning purposes.
