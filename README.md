[<div style="text-align:center"><img  src="docs/.vuepress/public/whispr_logo_charcoal_back.svg" height=300></div>]((https://sanofi-iadc.github.io/whispr/))

# Introduction

[![CI][ci-shield]][ci-url]
[![semantic-release][semantic-release-shield]][semantic-release-url]
[![MIT License][license-shield]][license-url]
[![Sonarcloud quality][sonarcloud-shield]][sonarcloud-url]
[![Renovate][renovate-shield]][renovate-url]
[![Gitpod ready-to-code][gitpod-shield]][gitpod-url]

Whispr is an open source event, comment and alert processing hub created by Sanofi IADC. We created it to meet our need for a centralised comment and alerting service which could be easily integrated into our tech stack.

Using Whispr you can easily add an event based pub sub system to your ecosystem. We’ve implemented a messaging service for users to communicate between our apps, and a business process status pub/sub alerting solution - any system can send an alert to Whispr, and susbscribing applications and users are automatically notified to display the alert and take action.

## To read more, go to our [documentation](https://sanofi-iadc.github.io/whispr/) site.

# Main features

* GraphQL and REST API for whisp creation
* Whisp classification through severity types
* Filtering using any of the base elements of a whisp
* Tag management system for whisp classification
* Webhooks
* Subscriptions through GraphQL with Websockets (more subscription types coming up very soon in our roadmap)

# Whispr consists of the following main elements

* Whispr core providing an whisp pub/sub system - publishing systems can register whisps in Whispr core when they need to share the status with. Whispr core can be used by any application capable of communicating with GraphQL or REST APIs
* A front end component library for fast implementation of some common use cases within your Vue.js or React based web application.

# Tech stack

## Whispr core
* [Nest.js](https://docs.nestjs.com/)
* GraphQL (out of the box with Nest.js)
* Webbsockets for GraphQL pub sub
* Webhook registration and triggering system for outgoing whisps
* Simple REST API

## Whispr UI

* [Vue.js](https://vuejs.org/)
* [Vuetify](https://vuetifyjs.com/)


# Sponsorship

We’re not looking for sponsorship, please check out the pages of our favourite open source projects which make up our standard tech stack.

## NestJS

[<img src="docs/assets/nestjs_logo.svg" height = 150>](https://docs.nestjs.com/support)

## Vue.js
[<img src="docs/assets/vuejs_logo.svg" height = 150>](https://vuejs.org/support-vuejs/)

## Vue-apollo
[<img src="docs/assets/vue_apollo_logo.png" height = 150>](https://github.com/sponsors/Akryum)


## Vuetify
[<img src="docs/assets/vuetify_logo.svg" height = 150>](https://vuetifyjs.com/en/introduction/sponsors-and-backers/)

[ci-shield]: https://github.com/Sanofi-IADC/whispr/workflows/CI/badge.svg?branch=master&event=push
[ci-url]: https://github.com/Sanofi-IADC/whispr/actions

[semantic-release-shield]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/Sanofi-IADC/whispr/releases

[license-shield]: https://img.shields.io/badge/License-MIT-green.svg
[license-url]: https://github.com/Sanofi-IADC/whispr/blob/master/LICENSE

[sonarcloud-shield]: https://sonarcloud.io/api/project_badges/measure?project=Sanofi-IADC_whispr&metric=alert_status
[sonarcloud-url]: https://sonarcloud.io/dashboard?id=Sanofi-IADC_whispr

[renovate-shield]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg
[renovate-url]: https://renovatebot.com

[gitpod-shield]: https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod
[gitpod-url]: https://gitpod.io/#https://github.com/Sanofi-IADC/whispr