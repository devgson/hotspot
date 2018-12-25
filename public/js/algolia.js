var search = instantsearch({
    appId: algoliaid,
    apiKey: searchkey, // search only API key, no ADMIN key
    indexName: 'listings',
    urlSync: true,
    searchParameters: {
        hitsPerPage: 10
    }
});

search.addWidget(
    instantsearch.widgets.searchBox({
        container: '#search-field'
    })
);

function renderFn(HitsRenderingOptions,helper) {
    HitsRenderingOptions.widgetParams.containerNode.html(
        HitsRenderingOptions.hits.map(function (hit,results) {
            console.log(hit);
            const hitTemplate = `
            <div class="col-xl-4 col-lg-6 col-md-6">
            <div class="strip grid">
                <figure>
                    <a class="wish_bt" href="#0"></a>
                    <a href="detail-restaurant.html"><img class="img-fluid" src="${hit.images}" alt="" />
                        <div class="read_more"><span>Read more</span></div>
                    </a><small>${hit.category}</small></figure>
                <div class="wrapper">
                    <h3><a href=/listing/${hit.slug}>${hit.title}</a></h3><small>${hit.info ? JSON.stringify(hit.info.address) : ''}</small>
                    <p>${hit.description ? hit.description : ''}</p><a class="address" href="" target="_blank">Get directions</a> </div>
                <ul>
                    <li><span class="loc_open">Now Open</span></li>
                    <li>
                        <div class="score"><span>Superb<em>350 Reviews</em></span><strong>8.9</strong></div>
                    </li>
                </ul>
            </div>
        </div>
            `
            return  hitTemplate;
        })
    );

    console.log(helper);
}

// connect `renderFn` to Hits logic
var customHits = instantsearch.connectors.connectHits(renderFn);

// mount widget on the page
search.addWidget(
    customHits({
        containerNode: $('#hits'),
    })
);

search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      maxPages: 20,
      // default is to scroll to 'body', here we disable this behavior
      scrollTo: false
    })
  );


search.start();