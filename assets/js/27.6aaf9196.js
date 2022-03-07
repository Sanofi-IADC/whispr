(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{414:function(t,s,a){"use strict";a.r(s);var n=a(54),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"security"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#security"}},[t._v("#")]),t._v(" Security")]),t._v(" "),a("h2",{attrs:{id:"authentication"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#authentication"}},[t._v("#")]),t._v(" Authentication")]),t._v(" "),a("p",[t._v("Whispr supports authentication via JWT, and can be configured to authenticate against mutliple configurations (mutliple issuers, multiple secrets).")]),t._v(" "),a("h3",{attrs:{id:"configuration"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#configuration"}},[t._v("#")]),t._v(" Configuration")]),t._v(" "),a("p",[t._v("Security is implemented via an extended version of passport-jwt which allows an array of configurations to be passed on startup.")]),t._v(" "),a("p",[t._v("To configure, set the "),a("code",[t._v("AUTH_CONFIG_SECRET")])]),t._v(" "),a("p",[t._v("_ Note that even though the "),a("code",[t._v("AUTH_CONFIG_SECRET")]),t._v(" is not necessarily a secret (in the case of config with JWKS providers), this environment variable is named "),a("code",[t._v("_SECRET")]),t._v(" to ensure that it is hidden by APM tools in case it contains secret keys. _")]),t._v(" "),a("p",[t._v("The provided configuration is very similar to the NestJS passport-jwt example with a few modifications:")]),t._v(" "),a("ul",[a("li",[t._v("it must be provided as a JSON string containing a "),a("code",[t._v("config")]),t._v(" property which is an array of valid passport-jwt configurations")]),t._v(" "),a("li",[t._v("the "),a("code",[t._v("jwtFromRequest")]),t._v(" function which tells passport-jwt where to find the JWT in the request (usually the "),a("code",[t._v("Authorization")]),t._v(" header) function must be deconstructed into an object containing funcName and args properties")]),t._v(" "),a("li",[a("code",[t._v("passportJwtSecret")]),t._v(" function should not be written in the configuration file, only the arguments are required in the "),a("code",[t._v("passportJwtSecret")]),t._v(" object")])]),t._v(" "),a("h3",{attrs:{id:"examples"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#examples"}},[t._v("#")]),t._v(" Examples")]),t._v(" "),a("p",[t._v("This is an example for multiple passport JWT configurations as they would be configured in Javascript.")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    secretOrKeyProvider"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("passportJwtSecret")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        cache"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        rateLimit"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        jwksRequestsPerMinute"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        jwksUri"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://auth.issuer.com"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\n    jwtFromRequest"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" ExtractJwt"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("fromAuthHeaderAsBearerToken")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    audience"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'MY_APP_AUDIENCE'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    issuer"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("https://auth.issuer.com/")]),a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    algorithms"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'RS256'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    jwtFromRequest"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" ExtractJwt"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("fromAuthHeaderAsBearerToken")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    ignoreExpiration"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    secretOrKey"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'APPX_SECRET_KEY'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    jwtFromRequest"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" ExtractJwt"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("fromBodyField")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'USER_JWT'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    ignoreExpiration"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    secretOrKey"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'APPY_SECRET_KEY'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),a("p",[t._v("And an example env file configuration for "),a("code",[t._v("AUTH_CONFIG_SECRET")]),t._v(" based on the configuration above.")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("AUTH_CONFIG_SECRET "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" \n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# note that in a .env file this should be formatted onto one line - it is shown multiline here for easier readability")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# see project example.env file for a single line config")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"config"')]),t._v(":"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"secretOrKeyProvider"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"cache"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" true,\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"rateLimit"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" true,\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jwksRequestsPerMinute"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jwksUri"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://uri.com"')]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jwtFromRequest"')]),t._v(":"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"funcName"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"fromAuthHeaderAsBearerToken"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"audience"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"MY_APP_AUDIENCE"')]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"issuer"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://fact.cognito.com/"')]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"algorithms"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'RS256'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jwtFromRequest"')]),t._v(":"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"funcName"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"fromAuthHeaderAsBearerToken"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ignoreExpiration"')]),t._v(":false,\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"secretOrKey"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"APPX_SECRET_KEY"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"jwtFromRequest"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"funcName"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"fromBodyField"')]),t._v(", args: "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'USER_JWT'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ignoreExpiration"')]),t._v(":false,\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"secretOrKey"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"APPY_SECRET_KEY"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h3",{attrs:{id:"secret-passed-through-environment-variable"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#secret-passed-through-environment-variable"}},[t._v("#")]),t._v(" Secret passed through environment variable")]),t._v(" "),a("p",[t._v("Good practice imposed to not store secret in version control managment system and retrieve it from an environment variable instead.\nDo so and setup the "),a("code",[t._v("secretOrKeyFromEnv")]),t._v(" config property with the name of an environment variable of your choice and leave "),a("code",[t._v("secretOrKey")]),t._v(" empty.  "),a("code",[t._v("secretOrKey")]),t._v(" will then be automatically filled with your environment variable's value.")]),t._v(" "),a("h2",{attrs:{id:"authorisation"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#authorisation"}},[t._v("#")]),t._v(" Authorisation")]),t._v(" "),a("p",[t._v("No specific authorisation is currently implemented in Whispr - if you are authenticated it is assumed that you should have access to all data in Whispr.")])])}),[],!1,null,null,null);s.default=e.exports}}]);