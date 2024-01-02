#!/usr/bin/env -S deno run --allow-net --allow-read

const r = String.raw;

const jnlp = (origin: string) => r`<?xml version="1.0" encoding="utf-8"?>
<jnlp spec="8.0+"
      codebase="http://${origin}"
      href="jnlp.jnlp">
  <security>
    <all-permissions />
  </security>
  <resources>
    <java version="1.8+" />
    <jar href="jar.jar" />
  </resources>
  <application-desc main-class="Main" />
</jnlp>`;

const index = () => r`<a href="/jnlp.jnlp">Java web start.</a>`

async function service(conn: Deno.Conn) {
  for await (using c of Deno.serveHttp(conn)) {
    const path = new URL(c.request.url).pathname;
    switch (path) {
      case "/jnlp.jnlp": {
        await c.respondWith(new Response(jnlp(c.request.headers.get("host") ?? "localhost"), {
          headers: {
            "content-type": "application/x-java-jnlp-file",
          },
        }));
        break;
      }
      case "/": {
        await c.respondWith(new Response(index(), {
          headers: {
            "content-type": "text/html",
          },
        }));
        break;
      }
      case "/jar.jar": {
        const fp = await Deno.open(new URL("./jar.jar", import.meta.url));
        await c.respondWith(new Response(fp.readable))
        break;
      }
      default: {
        await c.respondWith(new Response("Not Found.", { status: 404 }));
      }
    }
  }
}

using srv = Deno.listen({ port: 8000 });
for await (const conn of srv) {
  service(conn);
}
