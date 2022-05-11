import{_ as e,c as i}from"./app.d9bd5457.js";var a="/whispr/assets/whisprcommentfast.ace023f9.gif";const s={},t=i('<h1 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h1><p>Whispr is an open source event, comment and alert processing hub created by Sanofi IADC. We created it to meet our need for a centralised comment and alerting service which could be easily integrated into our tech stack.</p><p>In Whispr each event object is called a whisp. A whisp is classified with a severity level from info to critical, can have tags to further classify it, and has a generic data object which stores the detail of the whisp. As an example, a comment within an application could be a whisp of severity level info, with the comment text in the data object.</p><p>Using Whispr we\u2019ve implemented a messaging service for users to communicate between our apps, and a business process status pub/sub alerting solution - any system can send an alert to Whispr, and susbscribing applications and users are automatically notified to display the alert and take action.</p><h2 id="main-features" tabindex="-1"><a class="header-anchor" href="#main-features" aria-hidden="true">#</a> Main features</h2><ul><li>GraphQL and REST API for whisp creation</li><li>Whisp classification through severity types</li><li>Filtering using any of the base elements of a whisp</li><li>Tag management system for whisp classification</li><li>Subscriptions through GraphQL with Websockets (more subscription types coming up very soon in our roadmap)</li></ul><h2 id="example-use-cases-for-whispr" tabindex="-1"><a class="header-anchor" href="#example-use-cases-for-whispr" aria-hidden="true">#</a> Example use cases for Whispr</h2><ul><li>Equipment status sharing (alerting) from IoT equipment</li><li>Lightweight comment feed (messaging) solutions</li><li>Machine learning on a central hub of data to identify data trends (common root causes for alerts, alert patterns)</li></ul><h3 id="whispr-in-action" tabindex="-1"><a class="header-anchor" href="#whispr-in-action" aria-hidden="true">#</a> Whispr in action</h3><p><img src="'+a+'" alt="Chat application with whispr animated gif" title="Chat with whispr"></p><p><em>Demonstration of using whispr as a comment system. Each comment is a whisp with severity info, and tags are also defined as a separate object type in whispr. All user interface components you see are available for use in the whispr UI library.</em></p><h2 id="key-components" tabindex="-1"><a class="header-anchor" href="#key-components" aria-hidden="true">#</a> Key components</h2><p>Whispr consists of the following main elements:</p><ul><li><strong>Whispr core:</strong> providing an whisp pub/sub system - publishing systems can register whisps in Whispr core when they need to share the status with. Whispr core can be used by any application capable of communicating with GraphQL or REST APIs</li><li><strong>Whispr UI:</strong> A front end component library for fast implementation of some common use cases within your Vue.js or React based web application.</li></ul><h2 id="roadmap" tabindex="-1"><a class="header-anchor" href="#roadmap" aria-hidden="true">#</a> Roadmap</h2><ul><li>We have big plans for Whispr, here are a few of the key items Plugin system</li><li>Advanced filtering</li><li>Whisp schema registration and validation</li></ul>',16);function n(r,o){return t}var c=e(s,[["render",n],["__file","index.html.vue"]]);export{c as default};