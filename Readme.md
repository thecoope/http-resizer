A simple image resizer using VIPS.

## Install VIPS

On OS X: `brew install homebrew/science/vips

On Ubuntu:

```
sudo add-apt-repository -y ppa:lovell/trusty-backport-vips
sudo apt-get update
sudo apt-get install -y libvips-dev libgsf-1-dev
```

Other: see [libvips](https://github.com/jcupitt/libvips)

## Running

```
npm install
PORT=8000 node resizer.js
```

Then you can get resized images using `/resize/:width/:height/:url`, like:

```
http://localhost:8000/resize/100/100/http%3A%2F%2Fi.imgur.com%2Fr3CbX4f.jpg
```
