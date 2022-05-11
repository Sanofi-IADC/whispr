import{_ as n,c as s}from"./app.d9bd5457.js";const a={},e=s(`<h1 id="security" tabindex="-1"><a class="header-anchor" href="#security" aria-hidden="true">#</a> Security</h1><h2 id="authentication" tabindex="-1"><a class="header-anchor" href="#authentication" aria-hidden="true">#</a> Authentication</h2><p>Whispr supports authentication via JWT, and can be configured to authenticate against mutliple configurations (mutliple issuers, multiple secrets).</p><h3 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h3><p>Security is implemented via an extended version of passport-jwt which allows an array of configurations to be passed on startup.</p><p>To configure, set the <code>AUTH_CONFIG_SECRET</code></p><p>_ Note that even though the <code>AUTH_CONFIG_SECRET</code> is not necessarily a secret (in the case of config with JWKS providers), this environment variable is named <code>_SECRET</code> to ensure that it is hidden by APM tools in case it contains secret keys. _</p><p>The provided configuration is very similar to the NestJS passport-jwt example with a few modifications:</p><ul><li>it must be provided as a JSON string containing a <code>config</code> property which is an array of valid passport-jwt configurations</li><li>the <code>jwtFromRequest</code> function which tells passport-jwt where to find the JWT in the request (usually the <code>Authorization</code> header) function must be deconstructed into an object containing funcName and args properties</li><li><code>passportJwtSecret</code> function should not be written in the configuration file, only the arguments are required in the <code>passportJwtSecret</code> object</li></ul><h3 id="examples" tabindex="-1"><a class="header-anchor" href="#examples" aria-hidden="true">#</a> Examples</h3><p>This is an example for multiple passport JWT configurations as they would be configured in Javascript.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token punctuation">[</span><span class="token punctuation">{</span>
    <span class="token literal-property property">secretOrKeyProvider</span><span class="token operator">:</span> <span class="token function">passportJwtSecret</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">cache</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token literal-property property">rateLimit</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token literal-property property">jwksRequestsPerMinute</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
        <span class="token literal-property property">jwksUri</span><span class="token operator">:</span> <span class="token string">&quot;https://auth.issuer.com&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>

    <span class="token literal-property property">jwtFromRequest</span><span class="token operator">:</span> ExtractJwt<span class="token punctuation">.</span><span class="token function">fromAuthHeaderAsBearerToken</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">audience</span><span class="token operator">:</span> <span class="token string">&#39;MY_APP_AUDIENCE&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">issuer</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">https://auth.issuer.com/</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    <span class="token literal-property property">algorithms</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;RS256&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span>
    <span class="token literal-property property">jwtFromRequest</span><span class="token operator">:</span> ExtractJwt<span class="token punctuation">.</span><span class="token function">fromAuthHeaderAsBearerToken</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ignoreExpiration</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">secretOrKey</span><span class="token operator">:</span> <span class="token string">&#39;APPX_SECRET_KEY&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span>
    <span class="token literal-property property">jwtFromRequest</span><span class="token operator">:</span> ExtractJwt<span class="token punctuation">.</span><span class="token function">fromBodyField</span><span class="token punctuation">(</span><span class="token string">&#39;USER_JWT&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ignoreExpiration</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">secretOrKey</span><span class="token operator">:</span> <span class="token string">&#39;APPY_SECRET_KEY&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>And an example env file configuration for <code>AUTH_CONFIG_SECRET</code> based on the configuration above.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>AUTH_CONFIG_SECRET <span class="token operator">=</span> 
<span class="token comment"># note that in a .env file this should be formatted onto one line - it is shown multiline here for easier readability</span>
<span class="token comment"># see project example.env file for a single line config</span>
<span class="token punctuation">{</span><span class="token string">&quot;config&quot;</span>:<span class="token punctuation">[</span><span class="token punctuation">{</span>
        <span class="token string">&quot;secretOrKeyProvider&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
            <span class="token string">&quot;cache&quot;</span><span class="token builtin class-name">:</span> true,
            <span class="token string">&quot;rateLimit&quot;</span><span class="token builtin class-name">:</span> true,
            <span class="token string">&quot;jwksRequestsPerMinute&quot;</span><span class="token builtin class-name">:</span> <span class="token number">5</span>,
            <span class="token string">&quot;jwksUri&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;https://uri.com&quot;</span>
            <span class="token punctuation">}</span>,
        <span class="token string">&quot;jwtFromRequest&quot;</span>:<span class="token punctuation">{</span><span class="token string">&quot;funcName&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;fromAuthHeaderAsBearerToken&quot;</span><span class="token punctuation">}</span>,
        <span class="token string">&quot;audience&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;MY_APP_AUDIENCE&quot;</span>,
        <span class="token string">&quot;issuer&quot;</span><span class="token builtin class-name">:</span><span class="token string">&quot;https://fact.cognito.com/&quot;</span>,
        <span class="token string">&quot;algorithms&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&#39;RS256&#39;</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>,
    <span class="token punctuation">{</span>
        <span class="token string">&quot;jwtFromRequest&quot;</span>:<span class="token punctuation">{</span><span class="token string">&quot;funcName&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;fromAuthHeaderAsBearerToken&quot;</span><span class="token punctuation">}</span>,
        <span class="token string">&quot;ignoreExpiration&quot;</span>:false,
        <span class="token string">&quot;secretOrKey&quot;</span><span class="token builtin class-name">:</span><span class="token string">&quot;APPX_SECRET_KEY&quot;</span><span class="token punctuation">}</span>,
    <span class="token punctuation">{</span>
        <span class="token string">&quot;jwtFromRequest&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span><span class="token string">&quot;funcName&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;fromBodyField&quot;</span>, args: <span class="token string">&#39;USER_JWT&#39;</span><span class="token punctuation">}</span>,
        <span class="token string">&quot;ignoreExpiration&quot;</span>:false,
        <span class="token string">&quot;secretOrKey&quot;</span><span class="token builtin class-name">:</span><span class="token string">&quot;APPY_SECRET_KEY&quot;</span><span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h3 id="secret-passed-through-environment-variable" tabindex="-1"><a class="header-anchor" href="#secret-passed-through-environment-variable" aria-hidden="true">#</a> Secret passed through environment variable</h3><p>Good practice imposed to not store secret in version control managment system and retrieve it from an environment variable instead. Do so and setup the <code>secretOrKeyFromEnv</code> config property with the name of an environment variable of your choice and leave <code>secretOrKey</code> empty. <code>secretOrKey</code> will then be automatically filled with your environment variable&#39;s value.</p><h2 id="authorisation" tabindex="-1"><a class="header-anchor" href="#authorisation" aria-hidden="true">#</a> Authorisation</h2><p>No specific authorisation is currently implemented in Whispr - if you are authenticated it is assumed that you should have access to all data in Whispr.</p>`,18);function t(p,o){return e}var i=n(a,[["render",t],["__file","security.html.vue"]]);export{i as default};