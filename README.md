# URL Shortener Microservice

### User stories:

* I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

* When I visit that shortened URL, it will redirect me to my original link.

### Example creation usage:

[https://effy-shortener-microservice.glitch.me/new/https://www.google.com](https://effy-shortener-microservice.glitch.me/new/https://www.google.com)

[https://effy-shortener-microservice.glitch.me/new/http://foo.com:80](https://effy-shortener-microservice.glitch.me/new/http://foo.com:80)

###  Example creation output

`{ "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }`

### Usage:

https://little-url.herokuapp.com/2871

### Will redirect to:

https://www.google.com/