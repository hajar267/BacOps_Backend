<?php
/* 
Service providers are responsible for bootstrapping all of the framework's various components.
Laravel will iterate through this list of providers and instantiate each of them. 
After instantiating the providers, the register method will be called on all of the providers. 
Then, once all of the providers have been registered, the boot method will be called on each provider
*/

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
];
