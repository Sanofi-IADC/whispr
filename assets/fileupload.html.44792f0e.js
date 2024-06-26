import{_ as n,c as s}from"./app.2353e9b9.js";const a={},e=s(`<h1 id="file-upload" tabindex="-1"><a class="header-anchor" href="#file-upload" aria-hidden="true">#</a> File Upload</h1><h2 id="aws-dependency" tabindex="-1"><a class="header-anchor" href="#aws-dependency" aria-hidden="true">#</a> AWS Dependency</h2><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>This feature is currently <strong>only available with AWS</strong>.</p></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>This feature is only supported by the GraphQL-API, not the REST-API.</p></div><p>You need to provide the following environment variable.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># Optional</span>
AWS_S3_ENDPOINT <span class="token comment"># To set the S3 endpoint to something else then the default</span>

<span class="token comment"># Required</span>
AWS_BUCKET_NAME <span class="token comment"># The bucket name where the files should be uploaded</span>

<span class="token comment"># Required (Auth: Alternative 1 - auto)</span>
AWS_CONTAINER_CREDENTIALS_RELATIVE_URI <span class="token comment"># Automatically populated by ECS</span>

<span class="token comment"># Required (Auth: Alternative 2 - manual)</span>
COGNITO_ADMIN_USER <span class="token comment"># Username with permissions to write &amp; read from S3</span>
COGNITO_ADMIN_PW <span class="token comment"># Password for admin user</span>
COGNITO_USER_POOL_ID <span class="token comment"># Cognito User Pool ID</span>
COGNITO_CLIENT_ID_ADMIN <span class="token comment"># Cognito User Pool Client ID</span>
COGNITO_REGION <span class="token comment"># Region of Cognito instance</span>
COGNITO_IDENTITY_POOL_ID <span class="token comment"># Cognito Identity Pool ID</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><h3 id="upload" tabindex="-1"><a class="header-anchor" href="#upload" aria-hidden="true">#</a> Upload</h3><p>To upload a file together with your Whisp, you can use the attachment field. In order to upload a new File, pass:</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;attachments&quot;</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;Information about where you need the file to be used inside the whisp&gt;&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;file&quot;</span><span class="token operator">:</span><span class="token punctuation">{</span>
            <span class="token property">&quot;newFile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;binary&gt;&quot;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The binary inside of <strong>&quot;newFile&quot;</strong> will be uploaded to the S3-Bucket. The created S3-Key will be set as content of <strong>&quot;file&quot;</strong>.</p><p>When you pass the attachment property during an update, it will replace the old content. In order to keep previous uploaded files, you have to pass them along with new files like so:</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;attachments&quot;</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;Information about where you need the file to be used inside the whisp&gt;&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;file&quot;</span><span class="token operator">:</span><span class="token punctuation">{</span>
            <span class="token property">&quot;oldFile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;S3-Key-of-old-file&gt;&quot;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;Information about where you need the file to be used inside the whisp&gt;&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;file&quot;</span><span class="token operator">:</span><span class="token punctuation">{</span>
            <span class="token property">&quot;newFile&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;binary&gt;&quot;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="download" tabindex="-1"><a class="header-anchor" href="#download" aria-hidden="true">#</a> Download</h3><p>When you query your attachments the result will look like this:</p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;attachments&quot;</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token punctuation">{</span>
        <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;Information about where you need the file to be used inside the whisp&gt;&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;file&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;S3-Key&gt;&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To get the Binary of your file, send a <strong>GET</strong>-Request to <code>&lt;whispr-url&gt;/file/&lt;S3-Key&gt;</code>.</p>`,17);function t(o,i){return e}var l=n(a,[["render",t],["__file","fileupload.html.vue"]]);export{l as default};
