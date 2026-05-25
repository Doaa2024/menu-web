<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Local dev ports are always allowed. Production frontend URLs are added via
    // the FRONTEND_URLS env var (comma-separated), e.g.
    //   FRONTEND_URLS=https://your-menu.vercel.app,https://your-admin.vercel.app
    'allowed_origins' => array_values(array_filter(array_merge(
        ['http://localhost:5173', 'http://localhost:5174'],
        array_map('trim', explode(',', (string) env('FRONTEND_URLS', '')))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];