import{_ as e,c as i}from"./app.53b2618c.js";const a={},t=i('<h1 id="whisp" tabindex="-1"><a class="header-anchor" href="#whisp" aria-hidden="true">#</a> Whisp</h1><p>These are the available fields for the <strong>Whisp</strong> entity.</p><h2 id="id" tabindex="-1"><a class="header-anchor" href="#id" aria-hidden="true">#</a> _id</h2><p>Type: ID!</p><p>Description: Autogenerated scalar identifier</p><h2 id="readableid" tabindex="-1"><a class="header-anchor" href="#readableid" aria-hidden="true">#</a> readableID</h2><p>Type: String</p><p>Description: Auto generated (counter based) id you can use for filtering</p><h2 id="type" tabindex="-1"><a class="header-anchor" href="#type" aria-hidden="true">#</a> type</h2><p>Type: String</p><p>Description: To distinguiss between your whisp</p><h2 id="severity" tabindex="-1"><a class="header-anchor" href="#severity" aria-hidden="true">#</a> severity</h2><p>Type: Int</p><p>Description: Priority level lower number is higher priority</p><h2 id="description" tabindex="-1"><a class="header-anchor" href="#description" aria-hidden="true">#</a> description</h2><p>Type: String</p><p>Description: General decription</p><h2 id="closed" tabindex="-1"><a class="header-anchor" href="#closed" aria-hidden="true">#</a> closed</h2><p>Type: Boolean</p><p>Description: Does the action required by this whisp is done and closed</p><h2 id="applicationid" tabindex="-1"><a class="header-anchor" href="#applicationid" aria-hidden="true">#</a> applicationID</h2><p>Type: String</p><p>Description: Id of the client application that sent this whisp</p><h2 id="plantid" tabindex="-1"><a class="header-anchor" href="#plantid" aria-hidden="true">#</a> plantID</h2><p>Type: String</p><p>Description: Id of the Plan or factory of the subject this whisp has been created for</p><h2 id="locationid" tabindex="-1"><a class="header-anchor" href="#locationid" aria-hidden="true">#</a> locationID</h2><p>Type: String</p><p>Description: Locate the spacial position of the subject this whisp has been created for</p><h2 id="manual" tabindex="-1"><a class="header-anchor" href="#manual" aria-hidden="true">#</a> manual</h2><p>Type: Boolean</p><p>Description: Does this whisp has been created manually by human and not by an automated process</p><h2 id="openedby" tabindex="-1"><a class="header-anchor" href="#openedby" aria-hidden="true">#</a> openedBy</h2><p>Type: String</p><p>Description: Friendly name of the creator of this whisp</p><h2 id="openedbyid" tabindex="-1"><a class="header-anchor" href="#openedbyid" aria-hidden="true">#</a> openedById</h2><p>Type: String</p><p>Description: Id of the creator of this whisp</p><h2 id="closedby" tabindex="-1"><a class="header-anchor" href="#closedby" aria-hidden="true">#</a> closedBy</h2><p>Type: String</p><p>Description: Friendly name of the person who close or resolve this whisp</p><h2 id="closedbyid" tabindex="-1"><a class="header-anchor" href="#closedbyid" aria-hidden="true">#</a> closedById</h2><p>Type: String</p><p>Description: Id of the person who close or resolve this whisp</p><h2 id="timestamp" tabindex="-1"><a class="header-anchor" href="#timestamp" aria-hidden="true">#</a> timestamp</h2><p>Type: String</p><p>Description: Time and date when this whisp has been created in the source system. If not provided, a value is created once the whisp created in whispr server.</p><h2 id="updated" tabindex="-1"><a class="header-anchor" href="#updated" aria-hidden="true">#</a> updated</h2><p>Type: String</p><p>Description: Data and time of the last time the whisp as been changed or been created.</p><h2 id="timetolive-timetolivesec" tabindex="-1"><a class="header-anchor" href="#timetolive-timetolivesec" aria-hidden="true">#</a> timeToLive / timeToLiveSec</h2><p>Type: String / Number</p><p>Description: TimeToLive is the input string that is used to define the TTL. Smart format (using parse-duration library) can be used : e.g 1m, 1hour, 1h10sec, 10hour -1min . timeToLiveSec is the stored number of second after which this whisp will be delete automatically since its creation. Defining timeToLive automatically set the expirationDate field accordingly</p><h2 id="expirationdate" tabindex="-1"><a class="header-anchor" href="#expirationdate" aria-hidden="true">#</a> expirationDate</h2><p>Type: Date</p><p>Description: The date after which the whisp will be deleted automatically. defining expirationDate direclty clear the timeToLiveSec field</p><h2 id="data" tabindex="-1"><a class="header-anchor" href="#data" aria-hidden="true">#</a> data</h2><p>Type: JSONObject</p><p>Description: An object containing the details of the whisp specific to the application</p><h2 id="dataindexkey" tabindex="-1"><a class="header-anchor" href="#dataindexkey" aria-hidden="true">#</a> dataIndexKey</h2><p>Type: String</p><p>Description: A string which represent your data. You can store strings which are most used inside and represents your data. You can use this key in filter to query whisps instead of running complex queries on top of data object. This is an indexed field.</p>',62);function r(d,n){return t}var p=e(a,[["render",r],["__file","whisp.html.vue"]]);export{p as default};