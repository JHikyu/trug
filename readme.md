![Logo](https://i.imgur.com/lrDea6e.jpg)

From static file serve to full-stack web-appilcation

# Usage
## Project initialization
![Terminal](https://i.imgur.com/lCUdpmL.png)

## Startup
| Argument  | Value     | Description       |
| --------- | --------- | ----------------- |
| --port    | number    | Custom HTTP port  |
| -p        | number    | Custom HTTP port  |
| --sslport | number    | Custom HTTPS port |
| --ssl     |           | Enable HTTPS      |
| --path    | directory | Set custom path   |

![Terminal](https://i.imgur.com/Yc7vAVJ.png)

## Project structure
.
├── ...
├── views                   # Routes
│   ├── index.html          # Root endpoint on localhost/
│   ├── index.js            # Backend ran, when request on index.html
│   └── faq.pug             # Templates work fine localhost/faq (no .js needed)
├── public
│   ├── style.css           # localhost/style.css
├── src                     # Used for backend files
│   ├── testing.js
├── socket.js               # Optional
