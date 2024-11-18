import { renderToHtml } from "./customjsx/render.js";

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  return (
    <html>
      <head>
        <title>Custom JSX</title>
      </head>
      <body>
        <div class="container">
          <Greeting name="World" />
          <p>Welcome to JSX</p>
        </div>
      </body>
    </html>
  );
}

Deno.serve((req) => {
  const htmlPage = renderToHtml(<App />);
  const headers = { "Content-Type": "text/html" };
  return new Response(htmlPage, { headers });
});
