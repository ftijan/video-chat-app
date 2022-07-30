# Video Chat (Zoom-clone) App Example

Based on the Web Dev Simplifed tutorial found [here](https://youtu.be/DvlyzDZDEq4)

Uses the following libraries:
- `express` - to serve the content
- `ejs` - for templates
- `uuid` - for unique IDs
- `socket.io` - for Web Sockets
- `peer.js` - for Web RTC and peer-to-peer handling
- `nodemon` - for server hot reload

To run `peerjs` as a server, install as a global npm package, then run:
```
peerjs --port 3001
```